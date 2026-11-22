import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { formDb, formAuth, googleProvider } from '@/utils/firebase/client';
import { SamvityaPassHolder, GeneratedGtaTicket, MOCK_SAMVITYA_BUYERS } from '@/types/samvitya';

// Collection on vrgc-form where VTOP verified pass holders & generated GTA 6 entry tickets reside
export const SAMVITYA_BUYERS_COLLECTION = 'samvitya_passholders';
export const GTA6_TICKETS_COLLECTION = 'gta6_event_tickets';

/**
 * Triggers Google Sign-In with popup using the user's official VIT Bhopal email.
 */
export async function signInWithOfficialGoogleEmail(): Promise<{
  userEmail: string;
  displayName: string;
}> {
  const result = await signInWithPopup(formAuth, googleProvider);
  const user = result.user;
  if (!user.email) {
    throw new Error('No email found in Google account.');
  }

  return {
    userEmail: user.email.toLowerCase(),
    displayName: user.displayName || 'Participant',
  };
}

/**
 * Verifies if the email or registration number has a valid VTOP Samvitya pass.
 * Checks vrgc-form Firestore first; falls back gracefully to whitelisted mock buyers for testing/offline.
 */
export async function verifySamvityaBuyer(
  identifier: string
): Promise<{ verified: boolean; passHolder?: SamvityaPassHolder; error?: string }> {
  const cleanId = identifier.trim().toLowerCase();

  try {
    const buyersRef = collection(formDb, SAMVITYA_BUYERS_COLLECTION);
    
    // Check by email
    const emailQuery = query(buyersRef, where('email', '==', cleanId));
    let snapshot = await getDocs(emailQuery);

    // If not found by email, check by regNumber (uppercase)
    if (snapshot.empty) {
      const regQuery = query(buyersRef, where('regNumber', '==', cleanId.toUpperCase()));
      snapshot = await getDocs(regQuery);
    }

    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data();
      return {
        verified: true,
        passHolder: {
          email: docData.email || cleanId,
          name: docData.name || 'Participant',
          regNumber: docData.regNumber || '',
          vtopTransactionId: docData.vtopTransactionId || 'VTOP-VERIFIED',
          passType: docData.passType || 'SAMVITYA_FEST_PASS',
        },
      };
    }
  } catch (err) {
    console.warn('VRGC Form Firestore lookup warning, checking fallback whitelist:', err);
  }

  // Fallback verification check against verified mock pool
  const foundMock = MOCK_SAMVITYA_BUYERS.find(
    (b) =>
      b.email.toLowerCase() === cleanId ||
      b.regNumber.toLowerCase() === cleanId
  );

  if (foundMock) {
    return {
      verified: true,
      passHolder: foundMock,
    };
  }

  return {
    verified: false,
    error: 'No Samvitya VTOP ticket record found for this email / registration number.',
  };
}

/**
 * Stores the generated GTA VI venue ticket to vrgc-form database and returns ticket details.
 */
export async function issueGta6Ticket(
  passHolder: SamvityaPassHolder,
  category: string,
  preferredSlot: string
): Promise<GeneratedGtaTicket> {
  const ticketId = `GTA6-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const verificationCode = `VCPD-${Math.floor(100000 + Math.random() * 900000)}`;

  const ticketData: GeneratedGtaTicket = {
    ticketId,
    userEmail: passHolder.email,
    userName: passHolder.name,
    regNumber: passHolder.regNumber,
    vtopTransactionId: passHolder.vtopTransactionId || 'VTOP-SAMVITYA-PASS',
    eventTitle: 'GTA VI: VICE CITY CAMPUS SHOWDOWN (SAMVITYA 2026)',
    venue: 'Central Auditorium & Spatial Lab (Lab 304)',
    issuedAt: new Date().toISOString(),
    slotTime: preferredSlot || '17:00 IST - Evening Session',
    category: category || 'The Port Gellhorn Heist Run',
    qrPayload: JSON.stringify({
      tId: ticketId,
      usr: passHolder.regNumber,
      ev: 'GTA6_SAMVITYA',
      auth: verificationCode,
    }),
    verificationCode,
  };

  try {
    const ticketDocRef = doc(formDb, GTA6_TICKETS_COLLECTION, ticketId);
    await setDoc(ticketDocRef, {
      ...ticketData,
      createdAt: serverTimestamp(),
      verifiedAtVenue: false,
    });
  } catch (err) {
    console.warn('Could not persist ticket to vrgc-form Firestore directly, returning local ticket:', err);
  }

  // Also save to localStorage for offline access / re-entry
  if (typeof window !== 'undefined') {
    localStorage.setItem(`vrgc_gta6_ticket_${passHolder.regNumber}`, JSON.stringify(ticketData));
  }

  return ticketData;
}
