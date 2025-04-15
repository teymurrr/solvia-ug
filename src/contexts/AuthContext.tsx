
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  login: (type: UserType) => void; // For compatibility with existing code
  logout: () => void; // For compatibility with existing code
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        
        // If we have a user, try to determine the user type from metadata
        if (session?.user?.user_metadata) {
          const metadata = session.user.user_metadata;
          if (metadata.user_type) {
            setUserType(metadata.user_type as UserType);
          } else {
            // Default to 'professional' if not specified
            setUserType('professional');
          }
        } else {
          setUserType(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      
      // If we have a user, try to determine the user type from metadata
      if (session?.user?.user_metadata) {
        const metadata = session.user.user_metadata;
        if (metadata.user_type) {
          setUserType(metadata.user_type as UserType);
        } else {
          // Default to 'professional' if not specified
          setUserType('professional');
        }
      } else {
        setUserType(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
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
    // This is a temporary function for backward compatibility
    // In a real app, we would use Supabase signIn instead
    console.log(`Mock login as ${type}`);
  };

  // For compatibility with existing code
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
