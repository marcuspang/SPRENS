import { auth } from '@lib/firebase/app';
import { getRandomId, getRandomInt } from '@lib/random';
import type { Bookmark } from '@lib/types/bookmark';
import type { User } from '@lib/types/user';
import { walletClientToEthers5Signer } from '@lib/web3/config';
import { SSX, SSXEnsData } from '@spruceid/ssx';
import { disconnect, getWalletClient } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as signOutFirebase
} from 'firebase/auth';
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
  ens: SSXEnsData | undefined;
  showSignInModal: boolean;
  store: (key: any, value: any) => void;
  get: (key: string) => Promise<any>;
  syncOrbit: ({ likes, posts, user }: any) => void;
  createDataVault: () => void;
  handleSignIn: () => void;
  hasOrbit: boolean;
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
  const [loading, setLoading] = useState(false);

  const [ssxProvider, setSSX] = useState<SSX | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasOrbit, setHasOrbit] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [ens, setEns] = useState<SSXEnsData>();

  const { isConnected, address } = useAccount();
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
      const ssx = new SSX({
        resolveEns: true,
        providers: {
          web3: {
            driver: signer.provider
          }
        },
        modules: {
          storage: true
        }
      });
      setSSX(ssx);
      try {
        const { ens } = await ssx.signIn();
        if (ens !== undefined) {
          setEns(ens);

          const userHasOrbit = await ssx.storage.activateSession();
          setHasOrbit(userHasOrbit);
        } else {
          disconnect();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setSSX(null);
    }
  };

  const syncOrbit = ({ likes, posts, user }: any) => {
    if (address) {
      store('user/' + address, user);
    }
    likes?.map((like: any) => store('like/' + like.id, like));
    posts?.map((post: any) => store('post/' + post.post.id, post));
  };

  const createDataVault = async () => {
    await ssxProvider?.storage.hostOrbit();
    const userHasOrbit = await ssxProvider?.storage.activateSession();
    if (userHasOrbit !== undefined) {
      setHasOrbit(userHasOrbit);
    }
  };

  const store = async (key: any, value: any) => {
    await ssxProvider?.storage.put(key, value);
  };

  const get = async (key: string) => {
    const response = await ssxProvider?.storage.get(key);
    console.log({ response });
    if (response?.ok && response?.data.ok) {
      return response.data.data;
    }
    return null;
  };

  useEffect(() => {
    if (isConnected) initSSX();
  }, [walletClient]);

  const ssxHandler = async () => {
    await openWeb3Modal();
  };

  const handleSignIn = async () => {
    await ssxHandler();
  };

  useEffect(() => {
    (async () => {
      if (ssxProvider && isConnected && hasOrbit && address && user === null) {
        const response = await ssxProvider?.storage.get('user/' + address);
        if (!response.ok || !response.data.ok) {
          const normalizeName = address?.replace(/\s/g, '').toLowerCase();
          const randomInt = getRandomInt(1, 10_000);

          const newUser: User = {
            id: address,
            bio: null,
            name: address,
            theme: null,
            accent: null,
            website: null,
            location: null,
            photoURL: ens?.avatarUrl || '',
            username: ens?.domain || `${normalizeName}${randomInt}`,
            verified: false,
            following: [],
            followers: [],
            createdAt: new Date().getTime(),
            updatedAt: null,
            totalTweets: 0,
            totalPhotos: 0,
            pinnedTweet: null,
            coverPhotoURL: null
          };
          setUser(newUser);
          syncOrbit({ user: newUser });
        } else {
          setUser(response.data.data);
          syncOrbit({ user: response.data.data });
        }
      }
    })();
  }, [ssxProvider, isConnected, hasOrbit, address]);

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
    showSignInModal,
    ens,
    store,
    get,
    syncOrbit,
    createDataVault,
    handleSignIn,
    hasOrbit
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}
