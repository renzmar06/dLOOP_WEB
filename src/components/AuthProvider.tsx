'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loadUserFromStorage } from '@/redux/slices/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}