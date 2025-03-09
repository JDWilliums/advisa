import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  businessName?: string;
  industry?: string;
  businessSize?: string;
  location?: string;
  website?: string;
  phone?: string;
  bio?: string;
  goals?: string[];
  marketingChannels?: string[];
  avatarUrl?: string;
  hasCompletedOnboarding: boolean;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Create a new user profile
export const createUserProfile = async (uid: string, email: string): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid,
    email,
    hasCompletedOnboarding: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, userProfile);
  
  return userProfile;
};

// Get user profile by UID
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  
  // Add updated timestamp
  const updateData = {
    ...data,
    updatedAt: serverTimestamp()
  };
  
  await updateDoc(userRef, updateData);
};

// Complete onboarding
export const completeOnboarding = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
  try {
    console.log(`Completing onboarding for user ${uid} with data:`, profileData);
    
    // First check if the user document exists
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log(`User document doesn't exist for ${uid}, creating a new one`);
      // If the user document doesn't exist, create it first
      const newUserProfile: UserProfile = {
        uid,
        email: profileData.email || 'unknown@example.com',
        hasCompletedOnboarding: true,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, newUserProfile);
      console.log(`Created new user profile for ${uid}`);
    } else {
      // If the user document exists, update it
      const updateData = {
        ...profileData,
        hasCompletedOnboarding: true,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(userRef, updateData);
      console.log(`Updated existing user profile for ${uid}`);
    }
  } catch (error) {
    console.error(`Error completing onboarding for user ${uid}:`, error);
    throw error; // Re-throw to allow proper error handling upstream
  }
};

// Check if user has completed onboarding
export const hasCompletedOnboarding = async (uid: string): Promise<boolean> => {
  const userProfile = await getUserProfile(uid);
  return userProfile?.hasCompletedOnboarding || false;
}; 