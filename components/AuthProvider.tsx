'use client';

import { ReactNode } from 'react';

export interface AuthContextType {
  user: { id: string; email: string } | null;
  loading: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
