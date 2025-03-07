"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  debugAuthState: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Debug function to manually check auth state
  const debugAuthState = () => {
    console.log('DEBUG - Current auth state:', {
      currentUser: auth.currentUser?.email || 'null',
      contextUser: user?.email || 'null',
      pathname,
      loading
    });
    
    // For testing: Create a fake user if none exists
    if (!user) {
      console.log('DEBUG - Creating test user for debugging');
      // Create a fake user object that mimics a Firebase User
      const testUser = {
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        },
        providerData: [],
        getIdToken: () => Promise.resolve('fake-token'),
        toJSON: () => ({}),
      } as unknown as User;
      
      // Set the user in state
      setUser(testUser);
      
      // Redirect to dashboard if on auth page
      if (pathname === '/' || pathname === '/auth') {
        console.log('DEBUG - Redirecting test user to dashboard');
        router.push('/dashboard');
      }
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Redirect result successful:', result.user.email);
          setUser(result.user);
          
          if (pathname === '/' || pathname === '/auth') {
            router.push('/dashboard');
          }
        }
      })
      .catch((error) => {
        console.error('Redirect result error:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      });
    
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.email || 'No user');
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('User is authenticated:', user.email);
        if (pathname === '/' || pathname === '/auth') {
          console.log('Authenticated user at auth page, redirecting to dashboard');
          router.push('/dashboard');
        }
      } else {
        console.log('User is NOT authenticated');
        if (pathname?.startsWith('/dashboard')) {
          console.log('Unauthenticated user at /dashboard, redirecting to auth');
          router.push('/');
        }
      }
    }
  }, [user, loading, pathname, router]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For testing: If using test@example.com, create a fake user
      if (email === 'test@example.com') {
        console.log('Using test account, creating fake user');
        const testUser = {
          uid: 'test-user-id',
          email: 'test@example.com',
          displayName: 'Test User',
          emailVerified: true,
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          },
          providerData: [],
          getIdToken: () => Promise.resolve('fake-token'),
          toJSON: () => ({}),
        } as unknown as User;
        
        setUser(testUser);
        setLoading(false);
        
        // Redirect will happen in the routing effect
        return;
      }
      
      // Normal authentication flow
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign in successful:', result.user.email);
      setUser(result.user);
      setLoading(false);
      
      // Redirect will happen in the routing effect
    } catch (error) {
      console.error('Email sign in error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      await signInWithRedirect(auth, provider);
      // Redirect will happen automatically
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut(auth);
      console.log('Logout successful');
      setUser(null);
      setLoading(false);
      
      // Redirect will happen in the routing effect
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    logout,
    debugAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 