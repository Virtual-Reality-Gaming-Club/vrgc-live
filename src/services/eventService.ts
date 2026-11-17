import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { formDb } from '@/utils/firebase/client';
import { ClubEvent } from '@/types/events';

export const EVENTS_COLLECTION = 'events';

/**
 * Subscribes in real-time to the public events collection on vrgc-form.
 * 100% isolated to the 'events' collection.
 */
export function subscribeToPublicEvents(
  callback: (events: ClubEvent[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const eventsRef = collection(formDb, EVENTS_COLLECTION);
    const q = query(eventsRef, orderBy('eventDate', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ClubEvent[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            name: data?.name || 'Untitled Event',
            description: data?.description || '',
            venue: data?.venue || 'TBA',
            eventDate: data?.eventDate || '',
            eventTime: data?.eventTime || '',
            eventType: data?.eventType || 'Other',
            registrationLink: data?.registrationLink || '',
            status: data?.status || 'upcoming',
            bannerUrl: data?.bannerUrl || '',
            createdBy: data?.createdBy || '',
            createdAt: data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt || '',
            updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt || '',
          });
        });
        callback(list);
      },
      (err) => {
        console.warn('Real-time listener on public events warning:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to initialize public events listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}
