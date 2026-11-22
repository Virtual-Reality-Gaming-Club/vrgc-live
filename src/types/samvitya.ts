export interface SamvityaPassHolder {
  email: string;
  name: string;
  regNumber: string;
  vtopTransactionId?: string;
  passType: 'SAMVITYA_FEST_PASS' | 'VIP_ALL_ACCESS';
}

export interface GeneratedGtaTicket {
  ticketId: string;
  userEmail: string;
  userName: string;
  regNumber: string;
  vtopTransactionId: string;
  eventTitle: string;
  venue: string;
  issuedAt: string;
  slotTime: string;
  category: string;
  qrPayload: string;
  verificationCode: string;
}

// Sample mock buyers list for offline testing
export const MOCK_SAMVITYA_BUYERS: SamvityaPassHolder[] = [
  {
    email: 'mock.student1@vitbhopal.ac.in',
    name: 'Player One',
    regNumber: '24BCE00001',
    vtopTransactionId: 'VTOP-SMV-00001',
    passType: 'SAMVITYA_FEST_PASS',
  },
  {
    email: 'mock.student2@vitbhopal.ac.in',
    name: 'Player Two',
    regNumber: '24BCE00002',
    vtopTransactionId: 'VTOP-SMV-00002',
    passType: 'VIP_ALL_ACCESS',
  },
];

