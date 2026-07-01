import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Booking } from '../types';

export const useBooking = () => {
  const [bronlar, setBronlar] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'bronlar'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
        setBronlar(data);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const addBooking = async (booking: Omit<Booking, 'id'>) => {
    const ref = await addDoc(collection(db, 'bronlar'), booking);
    return ref.id;
  };

  const updateStatus = async (id: string, status: Booking['status']) => {
    await updateDoc(doc(db, 'bronlar', id), { status });
  };

  return { bronlar, loading, addBooking, updateStatus };
};