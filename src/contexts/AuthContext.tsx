
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserType = 'professional' | 'institution' | null;

interface AuthContextType {
  isLoggedIn: boolean;
  userType: UserType;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoggedIn = localStorage.getItem('isLoggedIn');
    return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
  });
  
  const [userType, setUserType] = useState<UserType>(() => {
    const savedUserType = localStorage.getItem('userType');
    return savedUserType ? (savedUserType as UserType) : null;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [isLoggedIn, userType]);

  const login = (type: UserType) => {
    setIsLoggedIn(true);
    setUserType(type);
    console.log("Logged in as:", type);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
