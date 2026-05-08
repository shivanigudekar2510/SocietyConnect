import React, { createContext, useState, useContext } from 'react';

type UserRole = 'resident' | 'guard' | 'secretary' | null;

interface AuthContextType {
  userToken: string | null;
  userRole: UserRole;
  userEmail: string | null;
  login: (token: string, role: UserRole, email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const login = (token: string, role: UserRole, email?: string) => {
    setUserToken(token);
    setUserRole(role);
    setUserEmail(email || null);
  };

  const logout = () => {
    setUserToken(null);
    setUserRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};