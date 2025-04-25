
import * as React from 'react';
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
  signUp: (
    email: string, 
    password: string, 
    metadata?: { 
      first_name?: string; 
      last_name?: string; 
      name?: string; 
      user_type: UserType;
      specialty?: string;
      open_to_relocation?: boolean;
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [userType, setUserType] = React.useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoggedIn(!!data.session);
      
      if (data.session?.user?.user_metadata) {
        setUserType(data.session.user.user_metadata.user_type);
      }
      
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        
        if (session?.user?.user_metadata) {
          setUserType(session.user.user_metadata.user_type);
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
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (rememberMe && session) {
      await supabase.auth.setSession({
        refresh_token: session.refresh_token || '',
        access_token: session.access_token || '',
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { 
    first_name?: string; 
    last_name?: string; 
    name?: string; 
    user_type: UserType;
    specialty?: string;
    open_to_relocation?: boolean;
  }) => {
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
    setIsLoggedIn(false);
    setUserType(null);
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
