import { auth } from '@lib/firebase/app';
import {
  userBookmarksCollection,
  userStatsCollection,
  usersCollection
} from '@lib/firebase/collections';
import { getRandomId, getRandomInt } from '@lib/random';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';
import type { User } from '@lib/types/user';
import { walletClientToEthers5Signer } from '@lib/web3/config';
import { SSX } from '@spruceid/ssx';
import { disconnect, getWalletClient } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/react';
import type { User as AuthUser } from 'firebase/auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as signOutFirebase
} from 'firebase/auth';
import type { WithFieldValue } from 'firebase/firestore';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';

type AuthContext = {
  user: User | null;
  error: Error | null;
  loading: boolean;
  isAdmin: boolean;
  randomSeed: string;
  userBookmarks: Bookmark[] | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  // web3
  ssxProvider: SSX | null;
  showSyncModal: boolean;
  showSuccessModal: boolean;
  showKeplerModal: boolean;
  showSignInModal: boolean;
  syncOrbit: () => void;
  createDataVault: () => void;
  closeSyncModal: () => void;
  closeSuccessModal: () => void;
  closeKeplerModal: () => void;
  closeSignInModal: () => void;
  handleSignIn: () => void;
};

export const AuthContext = createContext<AuthContext | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showKeplerModal, setShowKeplerModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const { isConnected } = useAccount();
  const { open: openWeb3Modal, isOpen } = useWeb3Modal();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    disconnect();
  }, []);

  const initSSX = async () => {
    const chainId = await walletClient?.getChainId();
    const newWalletClient = await getWalletClient({ chainId });
    const signer =
      newWalletClient !== null
        ? walletClientToEthers5Signer(newWalletClient)
        : null;
    if (signer) {
      let ssxConfig = {
        providers: {
          web3: {
            driver: signer.provider
          }
        },
        modules: {
          storage: {
            prefix: 'sprens',
            hosts: ['https://kepler.spruceid.xyz'],
            autoCreateNewOrbit: false
          }
        },
        enableDaoLogin: true
      };

      const ssx = new SSX(ssxConfig);
      setSSX(ssx);
      try {
        await ssx.signIn();
        const hasOrbit = await ssx.storage.activateSession();
        setShowSignInModal(false);
        setShowKeplerModal(!hasOrbit);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowSignInModal(false);
      setSSX(null);
    }
  };

  const syncOrbit = () => {
    closeSyncModal();
    // likes?.records?.map((like: any) => store('like/' + like.cid, like));
    // posts?.feed?.map((post: any) => store('post/' + post.post.cid, post));
    setShowSuccessModal(true);
  };

  const createDataVault = async () => {
    await ssxProvider?.storage.hostOrbit();
    setShowKeplerModal(false);
    setShowSyncModal(true);
  };

  //   const store = async (key: any, value: any) => {
  //     await ssxProvider?.storage.put(key, value);
  //   };

  useEffect(() => {
    if (isConnected) initSSX();
  }, [walletClient]);

  const ssxHandler = async () => {
    await openWeb3Modal();
  };

  const closeSyncModal = () => {
    disconnect();
    setShowSyncModal(false);
  };

  const closeSuccessModal = () => {
    disconnect();
    setShowSuccessModal(false);
  };

  const closeKeplerModal = () => {
    disconnect();
    setShowKeplerModal(false);
  };

  const closeSignInModal = () => {
    disconnect();
    setShowSignInModal(false);
  };

  const handleSignIn = async () => {
    await ssxHandler();
  };

  useEffect(() => {
    const manageUser = async (authUser: AuthUser): Promise<void> => {
      const { uid, displayName, photoURL } = authUser;

      const userSnapshot = await getDoc(doc(usersCollection, uid));

      if (!userSnapshot.exists()) {
        let available = false;
        let randomUsername = '';

        while (!available) {
          const normalizeName = displayName?.replace(/\s/g, '').toLowerCase();
          const randomInt = getRandomInt(1, 10_000);

          randomUsername = `${normalizeName as string}${randomInt}`;

          const randomUserSnapshot = await getDoc(
            doc(usersCollection, randomUsername)
          );

          if (!randomUserSnapshot.exists()) available = true;
        }

        const userData: WithFieldValue<User> = {
          id: uid,
          bio: null,
          name: displayName as string,
          theme: null,
          accent: null,
          website: null,
          location: null,
          photoURL: photoURL as string,
          username: randomUsername,
          verified: false,
          following: [],
          followers: [],
          createdAt: serverTimestamp(),
          updatedAt: null,
          totalTweets: 0,
          totalPhotos: 0,
          pinnedTweet: null,
          coverPhotoURL: null
        };

        const userStatsData: WithFieldValue<Stats> = {
          likes: [],
          tweets: [],
          updatedAt: null
        };

        try {
          await Promise.all([
            setDoc(doc(usersCollection, uid), userData),
            setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
          ]);

          const newUser = (await getDoc(doc(usersCollection, uid))).data();
          setUser(newUser as User);
        } catch (error) {
          setError(error as Error);
        }
      } else {
        const userData = userSnapshot.data();
        setUser(userData);
      }

      setLoading(false);
    };

    const handleUserAuth = (authUser: AuthUser | null): void => {
      setLoading(true);

      if (authUser) void manageUser(authUser);
      else {
        setUser(null);
        setLoading(false);
      }
    };

    onAuthStateChanged(auth, handleUserAuth);
  }, []);

  useEffect(() => {
    if (!user) return;

    const { id } = user;

    const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
      setUser(doc.data() as User);
    });

    const unsubscribeBookmarks = onSnapshot(
      userBookmarksCollection(id),
      (snapshot) => {
        const bookmarks = snapshot.docs.map((doc) => doc.data());
        setUserBookmarks(bookmarks);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeBookmarks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error as Error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutFirebase(auth);
    } catch (error) {
      setError(error as Error);
    }
  };

  const isAdmin = user ? user.username === 'ccrsxx' : false;
  const randomSeed = useMemo(getRandomId, [user?.id]);

  const value: AuthContext = {
    user,
    error,
    loading,
    isAdmin,
    randomSeed,
    userBookmarks,
    signOut,
    signInWithGoogle,
    ssxProvider,
    showSyncModal,
    showSuccessModal,
    showKeplerModal,
    showSignInModal,
    syncOrbit,
    createDataVault,
    closeSyncModal,
    closeSuccessModal,
    closeKeplerModal,
    closeSignInModal,
    handleSignIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}
