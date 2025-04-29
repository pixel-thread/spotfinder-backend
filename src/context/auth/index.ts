import { AuthContextT } from '@/types/auth/context';
import React from 'react';

export const AuthContext = React.createContext<AuthContextT | null>(null);
