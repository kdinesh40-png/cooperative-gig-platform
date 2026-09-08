import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  type Unsubscribe
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { sanitizeForFirestore } from './firestore-bookings';
import { ProviderProfile, Grievance, GovernanceProposal } from '@/types/cooperative';

const PROVIDERS_COLLECTION = 'providers';
const SETTINGS_COLLECTION = 'settings';
const GRIEVANCES_COLLECTION = 'grievances';
const PROPOSALS_COLLECTION = 'proposals';
const SOS_COLLECTION = 'sos_alerts';

export interface CooperativeSettings {
  cooperativeFeePercent: number;
  welfareFundPercent: number;
  updatedAt?: string;
}

export interface SosAlertRecord {
  bookingId: string;
  customerName: string;
  location: string;
  timestamp: string;
}

// ----------------------------------------------------
// 1. Providers (KYC Persistence)
// ----------------------------------------------------

export function subscribeToProviders(
  onUpdate: (providers: ProviderProfile[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    if (onError) onError(new Error('Firebase is not configured'));
    return () => {};
  }

  try {
    const colRef = collection(database, PROVIDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const providers: ProviderProfile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as ProviderProfile;
          providers.push({
            ...data,
            id: docSnap.id || data.id
          });
        });
        onUpdate(providers);
      },
      (err) => {
        console.error('[Firestore] subscribeToProviders error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: unknown) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function updateFirestoreProviderKyc(
  providerId: string,
  verificationStatus: 'approved' | 'pending' | 'rejected',
  policeVerificationBadge: boolean
): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, PROVIDERS_COLLECTION, providerId);
    const payload = sanitizeForFirestore({
      verificationStatus,
      policeVerificationBadge,
      updatedAt: new Date().toISOString()
    }) as Record<string, unknown>;
    await updateDoc(docRef, payload);
    console.log(`[Firestore] Updated provider KYC for ${providerId}`);
  } catch (err) {
    console.error(`[Firestore] Error updating provider KYC ${providerId}:`, err);
    throw err;
  }
}

export async function seedFirestoreInitialProvidersIfEmpty(seedData: ProviderProfile[]): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const colRef = collection(database, PROVIDERS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && seedData.length > 0) {
      for (const prov of seedData) {
        const docRef = doc(database, PROVIDERS_COLLECTION, prov.id);
        await setDoc(docRef, sanitizeForFirestore(prov) as Record<string, unknown>);
      }
      console.log('[Firestore] Seeded initial demo providers');
    }
  } catch (err) {
    console.warn('[Firestore] Error seeding providers:', err);
  }
}

// ----------------------------------------------------
// 2. Settings (Cooperative Fee Slab Persistence)
// ----------------------------------------------------

export function subscribeToCooperativeSettings(
  onUpdate: (settings: CooperativeSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    if (onError) onError(new Error('Firebase is not configured'));
    return () => {};
  }

  try {
    const docRef = doc(database, SETTINGS_COLLECTION, 'cooperative');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as CooperativeSettings;
          onUpdate(data);
        }
      },
      (err) => {
        console.error('[Firestore] subscribeToCooperativeSettings error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: unknown) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function updateFirestoreFeeSlab(cooperativeFeePercent: number): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, SETTINGS_COLLECTION, 'cooperative');
    const payload = sanitizeForFirestore({
      cooperativeFeePercent,
      welfareFundPercent: 2.0,
      updatedAt: new Date().toISOString()
    }) as Record<string, unknown>;
    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Fee slab set to ${cooperativeFeePercent}%`);
  } catch (err) {
    console.error('[Firestore] Error updating fee slab:', err);
    throw err;
  }
}

export async function seedFirestoreInitialSettingsIfEmpty(defaultFeePercent: number): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, SETTINGS_COLLECTION, 'cooperative');
    const snap = await getDocs(collection(database, SETTINGS_COLLECTION));
    if (snap.empty) {
      await setDoc(docRef, sanitizeForFirestore({
        cooperativeFeePercent: defaultFeePercent,
        welfareFundPercent: 2.0,
        updatedAt: new Date().toISOString()
      }) as Record<string, unknown>);
      console.log('[Firestore] Seeded initial cooperative settings');
    }
  } catch (err) {
    console.warn('[Firestore] Error seeding settings:', err);
  }
}

// ----------------------------------------------------
// 3. Grievances (Resolution Workflow Persistence)
// ----------------------------------------------------

export function subscribeToGrievances(
  onUpdate: (grievances: Grievance[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    if (onError) onError(new Error('Firebase is not configured'));
    return () => {};
  }

  try {
    const colRef = collection(database, GRIEVANCES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const grievances: Grievance[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Grievance;
          grievances.push({
            ...data,
            id: docSnap.id || data.id
          });
        });
        onUpdate(grievances);
      },
      (err) => {
        console.error('[Firestore] subscribeToGrievances error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: unknown) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function updateFirestoreGrievanceStatus(
  grievanceId: string,
  status: Grievance['status'],
  resolutionNotes?: string
): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, GRIEVANCES_COLLECTION, grievanceId);
    const payload = sanitizeForFirestore({
      status,
      resolutionNotes: resolutionNotes || 'Escrow released upon mutual customer satisfaction.',
      updatedAt: new Date().toISOString()
    }) as Record<string, unknown>;
    await updateDoc(docRef, payload);
    console.log(`[Firestore] Grievance ${grievanceId} updated to ${status}`);
  } catch (err) {
    console.error(`[Firestore] Error updating grievance ${grievanceId}:`, err);
    throw err;
  }
}

export async function createFirestoreGrievance(grievance: Grievance): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, GRIEVANCES_COLLECTION, grievance.id);
    const payload = sanitizeForFirestore(grievance) as Record<string, unknown>;
    await setDoc(docRef, payload);
    console.log(`[Firestore] Created grievance ${grievance.id}`);
  } catch (err) {
    console.error('[Firestore] Error creating grievance:', err);
    throw err;
  }
}

export async function seedFirestoreInitialGrievancesIfEmpty(seedData: Grievance[]): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const colRef = collection(database, GRIEVANCES_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && seedData.length > 0) {
      for (const g of seedData) {
        const docRef = doc(database, GRIEVANCES_COLLECTION, g.id);
        await setDoc(docRef, sanitizeForFirestore(g) as Record<string, unknown>);
      }
      console.log('[Firestore] Seeded initial grievances');
    }
  } catch (err) {
    console.warn('[Firestore] Error seeding grievances:', err);
  }
}

// ----------------------------------------------------
// 4. Governance Proposals & Voting Persistence
// ----------------------------------------------------

export function subscribeToProposals(
  onUpdate: (proposals: GovernanceProposal[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    if (onError) onError(new Error('Firebase is not configured'));
    return () => {};
  }

  try {
    const colRef = collection(database, PROPOSALS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const proposals: GovernanceProposal[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as GovernanceProposal;
          proposals.push({
            ...data,
            id: docSnap.id || data.id
          });
        });
        onUpdate(proposals);
      },
      (err) => {
        console.error('[Firestore] subscribeToProposals error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: unknown) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function voteFirestoreProposal(
  proposalId: string,
  updatedProposal: GovernanceProposal
): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, PROPOSALS_COLLECTION, proposalId);
    const payload = sanitizeForFirestore(updatedProposal) as Record<string, unknown>;
    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Vote submitted for proposal ${proposalId}`);
  } catch (err) {
    console.error(`[Firestore] Error voting on proposal ${proposalId}:`, err);
    throw err;
  }
}

export async function seedFirestoreInitialProposalsIfEmpty(seedData: GovernanceProposal[]): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const colRef = collection(database, PROPOSALS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty && seedData.length > 0) {
      for (const p of seedData) {
        const docRef = doc(database, PROPOSALS_COLLECTION, p.id);
        await setDoc(docRef, sanitizeForFirestore(p) as Record<string, unknown>);
      }
      console.log('[Firestore] Seeded initial proposals');
    }
  } catch (err) {
    console.warn('[Firestore] Error seeding proposals:', err);
  }
}

// ----------------------------------------------------
// 5. SOS Alerts (Emergency Hub)
// ----------------------------------------------------

export function subscribeToSosAlerts(
  onUpdate: (alert: SosAlertRecord | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) {
    if (onError) onError(new Error('Firebase is not configured'));
    return () => {};
  }

  try {
    const colRef = collection(database, SOS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(null);
        } else {
          const firstDoc = snapshot.docs[0].data() as SosAlertRecord;
          onUpdate(firstDoc);
        }
      },
      (err) => {
        console.error('[Firestore] subscribeToSosAlerts error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: unknown) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export async function createFirestoreSosAlert(alert: SosAlertRecord): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const docRef = doc(database, SOS_COLLECTION, alert.bookingId);
    const payload = sanitizeForFirestore(alert) as Record<string, unknown>;
    await setDoc(docRef, payload);
    console.log(`[Firestore] Created SOS Alert for ${alert.bookingId}`);
  } catch (err) {
    console.error('[Firestore] Error creating SOS Alert:', err);
    throw err;
  }
}

export async function resolveFirestoreSosAlert(bookingId?: string): Promise<void> {
  const database = getFirebaseDb();
  if (!isFirebaseConfigured() || !database) return;

  try {
    const colRef = collection(database, SOS_COLLECTION);
    const snap = await getDocs(colRef);
    for (const docSnap of snap.docs) {
      if (!bookingId || docSnap.id === bookingId) {
        await deleteDoc(docSnap.ref);
      }
    }
    console.log('[Firestore] Cleared SOS alert');
  } catch (err) {
    console.error('[Firestore] Error clearing SOS alert:', err);
  }
}
