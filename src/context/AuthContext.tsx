import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../lib/firebase';
import { UserProfile, UserAddress } from '../types';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAddress: (address: UserAddress) => Promise<void>;
  toggleAdminRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@commerceos.io', 'onyekpecornelius20@gmail.com'];
const LOCAL_USER_KEY = 'commerceos_auth_user';
const LOCAL_PROFILE_KEY = 'commerceos_auth_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or create initial doc
  const fetchOrCreateProfile = async (firebaseUser: User) => {
    try {
      if (db) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        const isDefaultAdmin = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase() || '');

        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          setUserProfile(data);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
          return;
        } else {
          const newProfile: UserProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
            photoURL: firebaseUser.photoURL || undefined,
            role: isDefaultAdmin ? 'admin' : 'customer',
            address: {
              fullName: firebaseUser.displayName || 'Valued Customer',
              street: '742 Evergreen Terrace',
              city: 'San Francisco',
              state: 'CA',
              zip: '94107',
              country: 'United States',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
          return;
        }
      }
    } catch (err) {
      console.warn('Could not sync profile from Firestore, using local state:', err);
    }

    // Local fallback profile
    const fallbackProfile: UserProfile = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'Member',
      role: ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase() || '') ? 'admin' : 'customer',
      address: {
        fullName: firebaseUser.displayName || 'Alex Morgan',
        street: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'United States',
      },
      createdAt: new Date().toISOString(),
    };
    setUserProfile(fallbackProfile);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(fallbackProfile));
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      try {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
              localStorage.setItem(LOCAL_USER_KEY, JSON.stringify({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              }));
              await fetchOrCreateProfile(firebaseUser);
            } else {
              setUserProfile(null);
              localStorage.removeItem(LOCAL_USER_KEY);
              localStorage.removeItem(LOCAL_PROFILE_KEY);
            }
            setLoading(false);
          },
          (err) => {
            console.warn('Firebase onAuthStateChanged error (switching to local auth):', err);
            setLoading(false);
          }
        );
        return () => unsubscribe();
      } catch (e) {
        console.warn('Failed to listen to auth state:', e);
        setLoading(false);
      }
    } else {
      // Local development mode without Firebase
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        if (res.user) {
          await fetchOrCreateProfile(res.user);
        }
        return;
      } catch (error: any) {
        console.warn('Firebase Google Sign In failed, falling back to local demo sign-in:', error);
      }
    }

    // Local Google Mock Login
    const demoUser = {
      uid: 'demo-google-user-1',
      email: 'alex.morgan@example.com',
      displayName: 'Alex Morgan',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    const demoProfile: UserProfile = {
      id: demoUser.uid,
      email: demoUser.email,
      displayName: demoUser.displayName,
      photoURL: demoUser.photoURL,
      role: 'customer',
      address: {
        fullName: demoUser.displayName,
        street: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'United States',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(demoUser);
    setUserProfile(demoProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(demoProfile));
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        if (res.user) {
          await fetchOrCreateProfile(res.user);
        }
        return;
      } catch (error: any) {
        console.warn('Firebase Email Sign In failed, checking local credentials:', error);
        if (error.code && error.code !== 'auth/api-key-not-valid') {
          throw error;
        }
      }
    }

    // Local Email Login
    const isDefaultAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const namePart = email.split('@')[0];
    const formattedName = isDefaultAdmin ? 'CommerceOS Admin' : namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const localUser = {
      uid: 'user-' + btoa(email).replace(/=/g, '').slice(0, 10),
      email: email,
      displayName: formattedName,
    };

    const localProfile: UserProfile = {
      id: localUser.uid,
      email: localUser.email,
      displayName: formattedName,
      role: isDefaultAdmin ? 'admin' : 'customer',
      address: {
        fullName: formattedName,
        street: isDefaultAdmin ? '1 Infinite Loop' : '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'United States',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(localUser);
    setUserProfile(localProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(localProfile));
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (res.user) {
          await updateProfile(res.user, { displayName: name });
          await fetchOrCreateProfile({ ...res.user, displayName: name } as any);
        }
        return;
      } catch (error: any) {
        console.warn('Firebase Sign Up failed, using local registration:', error);
        if (error.code && error.code !== 'auth/api-key-not-valid') {
          throw error;
        }
      }
    }

    // Local Registration
    const isDefaultAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const localUser = {
      uid: 'user-' + Date.now().toString(36),
      email: email,
      displayName: name,
    };

    const localProfile: UserProfile = {
      id: localUser.uid,
      email: localUser.email,
      displayName: name,
      role: isDefaultAdmin ? 'admin' : 'customer',
      address: {
        fullName: name,
        street: '100 Market Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'United States',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(localUser);
    setUserProfile(localProfile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(localProfile));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout error:', e);
      }
    }
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  const updateUserAddress = async (address: UserAddress) => {
    if (!user) return;
    try {
      if (db && isFirebaseConfigured) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { address, updatedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.warn('Update address cloud error:', e);
    }
    setUserProfile((prev) => {
      const updated = prev ? { ...prev, address } : null;
      if (updated) {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleAdminRole = async () => {
    if (!userProfile || !user) return;
    const newRole: 'admin' | 'customer' = userProfile.role === 'admin' ? 'customer' : 'admin';
    try {
      if (db && isFirebaseConfigured) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { role: newRole, updatedAt: new Date().toISOString() });
      }
    } catch (e) {
      console.warn('Toggle admin role cloud error:', e);
    }
    setUserProfile((prev) => {
      const updated: UserProfile | null = prev ? { ...prev, role: newRole } : null;
      if (updated) {
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isAdmin = userProfile?.role === 'admin' || ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateUserAddress,
        toggleAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

