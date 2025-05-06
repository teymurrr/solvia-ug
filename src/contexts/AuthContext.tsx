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
  signIn: (email: string, password: string) => Promise<void>;
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
      institution_type?: string;
      location?: string;
      website?: string;
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
      console.log("Initializing auth session...");
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state change event:", event);
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoggedIn(!!session);
          
          if (session?.user?.user_metadata) {
            console.log("User metadata:", session.user.user_metadata);
            setUserType(session.user.user_metadata.user_type);
          } else {
            setUserType(null);
          }
          
          setLoading(false);
        }
      );

      // THEN check for existing session
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        console.log("Got session data:", data.session ? "Session exists" : "No session");
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoggedIn(!!data.session);
        
        if (data.session?.user?.user_metadata) {
          console.log("User metadata from session:", data.session.user.user_metadata);
          setUserType(data.session.user.user_metadata.user_type);
        }
      } catch (error) {
        console.error("Unexpected error during session initialization:", error);
      } finally {
        setLoading(false);
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    initSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        
        // Check specifically for email confirmation errors
        if (error.message.includes('Email not confirmed')) {
          // Store the email for the confirmation page
          localStorage.setItem('pendingConfirmationEmail', email);
          throw new Error("Email not confirmed. Please check your inbox and confirm your email address.");
        }
        
        throw error;
      }
      
      console.log("Sign-in successful:", data.user ? "User authenticated" : "No user");
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata?: { 
    first_name?: string; 
    last_name?: string; 
    name?: string; 
    user_type: UserType;
    specialty?: string;
    open_to_relocation?: boolean;
    institution_type?: string;
    location?: string;
    website?: string;
  }) => {
    console.log(`Attempting to sign up with email: ${email}`);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        console.error("Sign-up error:", error);
        throw error;
      }

      // Store the email for the confirmation page
      localStorage.setItem('pendingConfirmationEmail', email);
      
      console.log("Sign-up successful:", data.user ? "User created" : "No user");
      
      // Return void to match the expected return type
    } catch (error) {
      console.error("Unexpected error during sign-up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log("Attempting to sign out");
    try {
      // First ensure we clear the local state regardless of API success
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
      setUserType(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out error:", error);
        throw error;
      }
      
      console.log("Sign-out successful");
    } catch (error) {
      console.error('Error signing out:', error);
      // We don't rethrow here to ensure the UI gets updated even if API fails
    }
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
