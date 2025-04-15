
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserType = 'professional' | 'institution';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  userType: UserType | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  login: (type: UserType) => void; 
  logout: () => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Configure Supabase auth with session persistence
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoggedIn(!!data.session);
      
      if (data.session?.user?.user_metadata) {
        const metadata = data.session.user.user_metadata;
        setUserType(metadata.user_type ?? 'professional');
      }
      
      setLoading(false);
    };

    initSession();

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        
        if (session?.user?.user_metadata) {
          const metadata = session.user.user_metadata;
          setUserType(metadata.user_type ?? 'professional');
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (rememberMe) {
      await supabase.auth.setSession({
        refresh_token: session?.refresh_token || '',
        access_token: session?.access_token || '',
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // For compatibility with existing code
  const login = (type: UserType) => {
    setUserType(type);
    setIsLoggedIn(true);
  };

  const logout = () => {
    signOut().catch(error => console.error("Error signing out:", error));
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isLoggedIn, 
      userType, 
      signIn, 
      signUp, 
      signOut,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
