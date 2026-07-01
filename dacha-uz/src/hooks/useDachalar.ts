import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Dacha } from '../types';

export const useDachalar = () => {
  const [dachalar, setDachalar] = useState<Dacha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'dachalar'),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Dacha));
        setDachalar(data);
        setLoading(false);
      },
      () => {
        setError('Malumotlarni yuklashda xato');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const addDacha = async (dacha: Omit<Dacha, 'id'>) => {
    await addDoc(collection(db, 'dachalar'), dacha);
  };

  const deleteDacha = async (id: string) => {
    await deleteDoc(doc(db, 'dachalar', id));
  };

  const updateDacha = async (id: string, data: Partial<Dacha>) => {
    await updateDoc(doc(db, 'dachalar', id), data);
  };

  return { dachalar, loading, error, addDacha, deleteDacha, updateDacha };
};