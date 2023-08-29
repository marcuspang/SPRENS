import { Button } from '@components/ui/button';
import { useAuth } from '@lib/context/auth-context';
import { Web3NetworkSwitch } from '@web3modal/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

const SIWE = () => {
  const { handleSignIn, createDataVault, hasOrbit, ens, ssxProvider } =
    useAuth();
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (ssxProvider && isConnected && hasOrbit) {
      router.push('/home');
    }
  }, [ssxProvider, isConnected, hasOrbit]);

  if (!isConnected) {
    return (
      <>
        <Button
          className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                   hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                   dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
          onClick={handleSignIn}
        >
          Sign in with Ethereum
        </Button>
        <p
          className='inner:custom-underline inner:custom-underline text-center text-xs
                   text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
        >
          Sign in With Ethereum and authorize SPRENS to have access to
          read/write to your data vault. By logging in you accept our&nbsp;
          <a
            href='https://spruceid.com/termsofuse'
            target='_blank'
            rel='noopener'
          >
            Terms of Use
          </a>
          &nbsp;and&nbsp;
          <a
            href='https://spruceid.com/privacypolicy'
            target='_blank'
            rel='noopener'
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className='text-center'>
          <Web3NetworkSwitch />
        </div>
      </>
    );
  }

  if (ens === undefined || ens?.domain == null) {
    return (
      <>
        <h2 className='text-center'>
          To use SPRENS, you need to have an ENS account
        </h2>
        <p
          className='inner:custom-underline inner:custom-underline text-center text-xs
                   text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
        >
          Please login to an Ethereum account with an ENS name.
        </p>
        <div className='text-center'>
          <Web3NetworkSwitch />
        </div>
      </>
    );
  }

  if (!hasOrbit) {
    return (
      <>
        <h2 className='text-center'>
          To use SPRENS, you need to create a Data Vault
        </h2>
        <Button
          className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                   hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                   dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
          onClick={createDataVault}
        >
          Create Data Vault
        </Button>
        <p
          className='inner:custom-underline inner:custom-underline text-center text-xs
                   text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
        >
          You don't currently have a data vault. Sign the message to create your
          data vault. You can change your data vault at any time afterwards.
        </p>
        <div className='text-center'>
          <Web3NetworkSwitch />
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Orbit successfully connected!</h2>
      <p
        className='inner:custom-underline inner:custom-underline text-center text-xs
                   text-light-secondary inner:text-accent-blue dark:text-dark-secondary'
      >
        Redirecting you shortly...
      </p>
    </>
  );
};

export default SIWE;
