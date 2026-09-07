import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  type Unsubscribe 
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { Booking, BookingStatus } from '@/types/cooperative';

const BOOKINGS_COLLECTION = 'bookings';

/**
 * Recursively strips undefined values so Firestore setDoc / updateDoc never crashes.
 * Firestore throws: "Function setDoc() called with invalid data. Unsupported field value: undefined".
 */
export function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean;
}

/**
 * Real-time listener for bookings collection using Firestore onSnapshot().
 * NO localStorage, NO polling, NO setInterval/setTimeout used.
 * Updates are pushed directly by Firebase WebSockets to all connected browser sessions.
 */
export function subscribeToBookings(
  onUpdate: (bookings: Booking[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    return () => {};
  }

  try {
    const bookingsCol = collection(database, BOOKINGS_COLLECTION);
    const unsubscribe = onSnapshot(
      bookingsCol,
      (snapshot) => {
        const bookings: Booking[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as Booking;
          bookings.push({
            ...data,
            id: docSnapshot.id || data.id
          });
        });

        // Chronologically sort descending by createdAt
        bookings.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        onUpdate(bookings);
      },
      (error) => {
        console.error('[Firestore] onSnapshot error on bookings:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error: any) {
    console.error('[Firestore] Failed to attach onSnapshot listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Real-time listener specifically filtered for a given provider (e.g. Ramesh).
 * Returns real-time updates for bookings assigned to providerId or unassigned.
 */
export function subscribeToProviderBookings(
  providerId: string,
  onUpdate: (bookings: Booking[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return subscribeToBookings((allBookings) => {
    // Filter bookings relevant to this provider
    const providerBookings = allBookings.filter(
      b => !b.providerId || b.providerId === providerId
    );
    onUpdate(providerBookings);
  }, onError);
}

/**
 * Persists a newly created booking to Firestore.
 * Automatically sanitizes any undefined fields to prevent Firestore serialization errors.
 */
export async function createFirestoreBooking(booking: Booking): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    console.warn('[Firestore] Skipping createFirestoreBooking: Firebase not configured');
    return;
  }

  try {
    const bookingDocRef = doc(database, BOOKINGS_COLLECTION, booking.id);
    const payload = sanitizeForFirestore(booking);
    await setDoc(bookingDocRef, payload);
    console.log(`[Firestore] Successfully created booking ${booking.id}`);
  } catch (error) {
    console.error(`[Firestore] Error writing booking ${booking.id}:`, error);
    throw error;
  }
}

/**
 * Persists booking status updates to Firestore.
 * This triggers onSnapshot across all connected client browser tabs.
 */
export async function updateFirestoreBookingStatus(
  bookingId: string, 
  status: BookingStatus,
  extraFields: Partial<Booking> = {}
): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    console.warn('[Firestore] Skipping updateFirestoreBookingStatus: Firebase not configured');
    return;
  }

  try {
    const bookingDocRef = doc(database, BOOKINGS_COLLECTION, bookingId);
    const updatePayload: Record<string, any> = {
      status,
      ...extraFields
    };
    if (status === 'completed' && !extraFields.completedAt) {
      updatePayload.completedAt = new Date().toISOString();
    }
    const sanitized = sanitizeForFirestore(updatePayload);
    await updateDoc(bookingDocRef, sanitized);
    console.log(`[Firestore] Successfully updated booking ${bookingId} to ${status}`);
  } catch (error) {
    console.error(`[Firestore] Error updating booking ${bookingId} status:`, error);
    throw error;
  }
}

/**
 * Seeds initial demo bookings to Firestore if the collection is completely empty.
 * Ensures the SIH demo scenario is immediately testable upon initial setup.
 */
export async function seedFirestoreInitialBookingsIfEmpty(seedData: Booking[]): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    return;
  }

  try {
    const bookingsCol = collection(database, BOOKINGS_COLLECTION);
    const existingSnap = await getDocs(bookingsCol);
    if (existingSnap.empty && seedData.length > 0) {
      for (const booking of seedData) {
        const docRef = doc(database, BOOKINGS_COLLECTION, booking.id);
        await setDoc(docRef, sanitizeForFirestore(booking));
      }
      console.log('[Firestore] Seeded initial demo booking into Firestore.');
    }
  } catch (error) {
    console.warn('[Firestore] Note: Could not auto-seed demo data to Firestore:', error);
  }
}
