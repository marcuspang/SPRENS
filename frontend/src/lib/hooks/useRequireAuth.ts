import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import type { User } from '@lib/types/user';

export function useRequireAuth(redirectUrl?: string): User | null {
  const { user, loading, ssxProvider } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    if (!loading && (ssxProvider === null || user === null)) {
      replace(redirectUrl ?? '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return user;
}
