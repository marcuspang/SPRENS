import { Button } from '@components/ui/button';
import { useAuth } from '@lib/context/auth-context';
import SIWE from './siwe';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth();

  return (
    <main className='mx-auto py-12'>
      <div className='flex flex-col items-center justify-between gap-6 p-8 lg:justify-center'>
        <div className='flex max-w-xs flex-col gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
          <h1 className='text-center text-4xl'>SPRENS</h1>
        </div>
        <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
          <div className='grid gap-3 font-bold'>
            <SIWE />
            <Button onClick={signInWithGoogle}>Sign in with google</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
