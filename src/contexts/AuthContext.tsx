"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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
import { 
  createUserProfile, 
  getUserProfile, 
  hasCompletedOnboarding, 
  completeOnboarding,
  UserProfile 
} from "@/lib/userService";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  createUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  debugAuthState: () => void;
  checkOnboardingStatus: () => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
      userProfile: userProfile ? {
        hasCompletedOnboarding: userProfile.hasCompletedOnboarding,
        businessName: userProfile.businessName,
        industry: userProfile.industry
      } : null,
      loading,
      error,
      currentPath: pathname,
      currentAuthUser: auth.currentUser ? auth.currentUser.email : "No current auth user"
    });
  };

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const profile = await getUserProfile(userId);
      
      // If no profile exists, create one
      if (!profile) {
        console.log("No profile found, creating a new one");
        const newProfile = await createUserProfile(
          userId, 
          user?.email || 'unknown@example.com'
        );
        setUserProfile(newProfile);
        return newProfile;
      }
      
      console.log("Profile found:", profile);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, [user?.email, setUserProfile]);

  // Refresh user profile data
  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    await fetchUserProfile(user.uid);
  }, [user, fetchUserProfile]);

  // Check if user has completed onboarding
  const checkOnboardingStatus = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const completed = await hasCompletedOnboarding(user.uid);
      return completed;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return false;
    }
  }, [user]);

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
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? `User: ${currentUser.email}` : "No user");
      
      setUser(currentUser);
      
      // Fetch user profile if user is authenticated
      if (currentUser) {
        const profile = await fetchUserProfile(currentUser.uid);
        
        // Check for pending onboarding data in localStorage
        const pendingData = localStorage.getItem('pendingOnboardingData');
        if (pendingData && profile && !profile.hasCompletedOnboarding) {
          try {
            console.log("Found pending onboarding data in localStorage");
            const parsedData = JSON.parse(pendingData);
            
            // Save the pending data to Firestore
            await completeOnboarding(currentUser.uid, parsedData);
            console.log("Successfully saved pending onboarding data to Firestore");
            
            // Refresh the user profile
            await fetchUserProfile(currentUser.uid);
            
            // Clear the pending data
            localStorage.removeItem('pendingOnboardingData');
          } catch (error) {
            console.error("Error saving pending onboarding data:", error);
          }
        }
        
        // Handle routing based on auth state and onboarding status
        console.log("User is authenticated, current path:", pathname);
        
        // If on auth page and authenticated, redirect to dashboard or onboarding
        if (pathname === "/" || pathname === "/auth" || pathname === "/auth/signin") {
          if (profile && profile.hasCompletedOnboarding) {
            console.log("Redirecting authenticated user to dashboard");
            router.push("/dashboard");
          } else {
            console.log("Redirecting authenticated user to onboarding");
            router.push("/onboarding");
          }
        }
      } else {
        setUserProfile(null);
        console.log("User is not authenticated, current path:", pathname);
        
        // If on dashboard or onboarding and not authenticated, redirect to auth
        if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/onboarding")) {
          console.log("Redirecting unauthenticated user to auth page");
          router.push("/");
        }
      }
      
      setLoading(false);
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
  }, [router, pathname, fetchUserProfile]);

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
      
      // Fetch or create user profile
      await fetchUserProfile(userCredential.user.uid);
      
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
      const provider = new GoogleAuthProvider();
      
      // Set persistence to LOCAL before signing in
      await setPersistence(auth, browserLocalPersistence);
      
      // Use popup for better UX
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user.email);
      setUser(result.user);
      
      // Fetch or create user profile
      await fetchUserProfile(result.user.uid);
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (error instanceof Error) {
        // Log specific Firebase error codes for debugging
        const errorCode = (error as any).code;
        console.error(`Firebase error code: ${errorCode}`);
        
        // Provide user-friendly error messages
        if (errorCode === 'auth/popup-closed-by-user') {
          setError("Sign-in was cancelled. Please try again.");
        } else if (errorCode === 'auth/popup-blocked') {
          setError("Pop-up was blocked by your browser. Please allow pop-ups for this site.");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unknown error occurred during Google sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    console.log("Attempting to log out");
    setLoading(true);
    setError(null);
    
    try {
      await signOut(auth);
      console.log("Logout successful");
      setUser(null);
      setUserProfile(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      
      if (error instanceof Error) {
        setError(`Logout error: ${error.message}`);
      } else {
        setError("An unknown error occurred during logout");
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
      
      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, userCredential.user.email || '');
      
      // Redirect to onboarding instead of dashboard
      router.push("/onboarding");
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
    userProfile,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    createUser,
    logout,
    debugAuthState,
    checkOnboardingStatus,
    refreshUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 