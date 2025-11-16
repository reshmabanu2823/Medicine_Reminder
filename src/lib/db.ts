import { USE_FIREBASE, db } from './firebase';
// Firestore helpers (lazy) with localStorage fallback
type Medicine = {
  id: string;
  name: string;
  dosage: string;
  qty: number;
  expiry?: string;
};

const LS_KEY = 'medicines_v1';

// Local fallback implementations
function readLocal(): Medicine[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('readLocal error', e);
    return [];
  }
}

function writeLocal(items: Medicine[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('writeLocal error', e);
  }
}

export async function getMedicines(): Promise<Medicine[]> {
  if (USE_FIREBASE && db) {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const q = collection(db, 'medicines');
      const snap = await getDocs(q);
      const items: Medicine[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      return items;
    } catch (e) {
      console.warn('Firestore read error', e);
      return readLocal();
    }
  }
  return readLocal();
}

export async function saveMedicine(item: Medicine): Promise<void> {
  if (USE_FIREBASE && db) {
    try {
      const { doc, setDoc, collection } = await import('firebase/firestore');
      const ref = doc(collection(db, 'medicines'), item.id);
      await setDoc(ref, { name: item.name, dosage: item.dosage, qty: item.qty, expiry: item.expiry });
      return;
    } catch (e) {
      console.warn('Firestore write error', e);
    }
  }
  // fallback: update localStorage
  const cur = readLocal();
  const idx = cur.findIndex(c => c.id === item.id);
  if (idx >= 0) cur[idx] = item; else cur.push(item);
  writeLocal(cur);
}

export async function deleteMedicine(id: string): Promise<void> {
  if (USE_FIREBASE && db) {
    try {
      const { doc, deleteDoc, collection } = await import('firebase/firestore');
      const ref = doc(collection(db, 'medicines'), id);
      await deleteDoc(ref);
      return;
    } catch (e) {
      console.warn('Firestore delete error', e);
    }
  }
  const cur = readLocal().filter(i => i.id !== id);
  writeLocal(cur);
}

// Simple subscribe for local changes (polling-based) — for prototype only
let pollHandle: number | null = null;
export function subscribeMedicines(cb: (items: Medicine[]) => void) {
  if (USE_FIREBASE && db) {
    (async () => {
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const q = collection(db, 'medicines');
        const unsub = onSnapshot(q, snap => {
          const items: Medicine[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
          cb(items);
        });
        // return unsub function
        return unsub;
      } catch (e) {
        console.warn('subscribe error', e);
        // fallback to local
      }
    })();
  }

  // fallback: simple polling every 1.5s
  if (pollHandle) clearInterval(pollHandle);
  pollHandle = window.setInterval(() => {
    cb(readLocal());
  }, 1500);

  return () => { if (pollHandle) clearInterval(pollHandle); };
}
