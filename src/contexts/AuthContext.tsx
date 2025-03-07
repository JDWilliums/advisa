"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  getRedirectResult,
  getAuth,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  Auth,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  createUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  debugAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Debug function to log current auth state
  const debugAuthState = () => {
    console.log("Current auth state:", {
      user: user ? { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        isAnonymous: user.isAnonymous,
        providerData: user.providerData
      } : null,
      loading,
      error,
      currentPath: pathname,
      currentAuthUser: auth.currentUser ? auth.currentUser.email : "No current auth user"
    });
  };

  // Set persistence to LOCAL (this helps with page refreshes)
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        console.log("Setting up persistence to LOCAL");
        await setPersistence(auth, browserLocalPersistence);
        console.log("Persistence set successfully");
      } catch (error) {
        console.error("Error setting persistence:", error);
      }
    };
    
    setupPersistence();
  }, []);

  // Check for redirect result on initial load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log("Checking redirect result...");
        console.log("Current auth state before checking redirect:", auth.currentUser?.email || "No user");
        
        const result = await getRedirectResult(auth);
        
        if (result) {
          console.log("Redirect result found:", {
            user: result.user.email,
            providerId: result.providerId,
            operationType: result.operationType
          });
          // User successfully signed in with redirect
          setUser(result.user);
          router.push("/dashboard");
        } else {
          console.log("No redirect result found");
          // Check if we have a current user anyway
          if (auth.currentUser) {
            console.log("But we have a current user:", auth.currentUser.email);
            setUser(auth.currentUser);
          }
        }
      } catch (error) {
        console.error("Error checking redirect result:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message, error.stack);
          setError(`Redirect error: ${error.message}`);
        } else {
          setError("An unknown error occurred during redirect sign-in");
        }
      }
    };

    checkRedirectResult();
  }, [router]);

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    console.log("Firebase auth object:", auth ? "exists" : "does not exist");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.email}` : "No user");
      
      setUser(currentUser);
      setLoading(false);
      
      // Handle routing based on auth state
      if (currentUser) {
        console.log("User is authenticated, current path:", pathname);
        
        // If on auth page and authenticated, redirect to dashboard
        if (pathname === "/" || pathname === "/auth" || pathname === "/auth/signin") {
          console.log("Redirecting authenticated user to dashboard");
          router.push("/dashboard");
        }
      } else {
        console.log("User is not authenticated, current path:", pathname);
        
        // If on dashboard and not authenticated, redirect to auth
        if (pathname?.startsWith("/dashboard")) {
          console.log("Redirecting unauthenticated user to auth page");
          router.push("/");
        }
      }
    }, (error) => {
      // This is the error handler for onAuthStateChanged
      console.error("Auth state change error:", error);
      setError(`Auth state error: ${error.message}`);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, [router, pathname]);

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    console.log(`Attempting to sign in with email: ${email}`);
    setLoading(true);
    setError(null);
    
    try {
      // Set persistence to LOCAL before signing in
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email sign-in successful:", userCredential.user.email);
      setUser(userCredential.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Email sign-in error:", error);
      
      if (error instanceof Error) {
        // Log specific Firebase error codes for debugging
        const errorCode = (error as any).code;
        console.error(`Firebase error code: ${errorCode}`);
        
        // Provide user-friendly error messages
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          setError("Invalid email or password. If you haven't registered yet, please create an account first.");
        } else if (errorCode === 'auth/invalid-email') {
          setError("Invalid email format");
        } else if (errorCode === 'auth/too-many-requests') {
          setError("Too many failed login attempts. Please try again later");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unknown error occurred during sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    console.log("Attempting to sign in with Google");
    setLoading(true);
    setError(null);
    
    try {
      // Set persistence to LOCAL before signing in
      await setPersistence(auth, browserLocalPersistence);
      
      const provider = new GoogleAuthProvider();
      // Add select_account to force the account selection prompt
      provider.setCustomParameters({ 
        prompt: 'select_account',
        // Add additional parameters to help with CORS issues
        auth_type: 'rerequest',
        include_granted_scopes: 'true'
      });
      
      // First try with redirect (better for mobile)
      try {
        console.log("Starting Google sign-in redirect...");
        await signInWithRedirect(auth, provider);
        console.log("Redirecting to Google sign-in...");
        // The redirect will happen, and the result will be handled in the useEffect above
      } catch (redirectError) {
        // If redirect fails, fall back to popup
        console.error("Redirect sign-in failed, falling back to popup:", redirectError);
        
        try {
          console.log("Starting Google sign-in popup...");
          const result = await signInWithPopup(auth, provider);
          console.log("Popup sign-in successful:", result.user.email);
          setUser(result.user);
          router.push("/dashboard");
        } catch (popupError) {
          console.error("Popup sign-in also failed:", popupError);
          throw popupError; // Re-throw to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
        setError(`Google sign-in error: ${error.message}`);
      } else {
        setError("An unknown error occurred during Google sign-in");
      }
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    console.log("Attempting to sign out");
    setLoading(true);
    
    try {
      await signOut(auth);
      console.log("Sign out successful");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
        setError(`Logout error: ${error.message}`);
      } else {
        setError("An unknown error occurred during sign-out");
      }
    } finally {
      setLoading(false);
    }
  };

  // Create user with email and password
  const createUser = async (email: string, password: string) => {
    console.log(`Attempting to create user with email: ${email}`);
    setLoading(true);
    setError(null);
    
    try {
      // Set persistence to LOCAL before creating user
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User creation successful:", userCredential.user.email);
      setUser(userCredential.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("User creation error:", error);
      
      if (error instanceof Error) {
        // Log specific Firebase error codes for debugging
        const errorCode = (error as any).code;
        console.error(`Firebase error code: ${errorCode}`);
        
        // Provide user-friendly error messages
        if (errorCode === 'auth/email-already-in-use') {
          setError("Email is already in use");
        } else if (errorCode === 'auth/invalid-email') {
          setError("Invalid email format");
        } else if (errorCode === 'auth/weak-password') {
          setError("Password is too weak");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unknown error occurred during user creation");
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    createUser,
    logout,
    debugAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 