import { Button } from '@components/ui/button';
import { useAuth } from '@lib/context/auth-context';

const SIWE = () => {
  const { handleSignIn } = useAuth();

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
        Sign in With Ethereum and authorize SPRENS to have access to read/write
        to your data vault. By logging in you accept our&nbsp;
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
      {/*
      <Modal open={showKeplerModal} closeModal={closeKeplerModal}>
        <h2>Create Data Vault</h2>
        You don't currently have a data vault. <br />
        Sign the message to create your data vault.
        <button
          onClick={createDataVault}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
        >
          CREATE DATA VAULT
        </button>
      </Modal>

      <strong
        onClick={() => {
          if (isConnected) {
            disconnect();
          } else {
            setShowSignInModal(true);
          }
        }}
        style={{
          marginTop: '2rem',
          alignSelf: 'left',
          color: '#323232',
          backgroundColor: 'white',
          border: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
        <br />
      </strong>
      {isConnected ? (
        <button
          onClick={syncOrbit}
          style={{
            color: '#323232',
            marginTop: '2rem',
            backgroundColor: 'white',
            border: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: '-6px'
          }}
        >
          <strong>Sync</strong>
        </button>
      ) : null}

      <Modal open={showSyncModal} closeModal={closeSyncModal}>
        <h2>Wallet successfully connected!</h2>
        <button
          onClick={syncOrbit}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
        >
          sync orbit
        </button>
      </Modal>

      <Modal open={showSuccessModal} closeModal={closeSuccessModal}>
        <h2>Orbit Successfully Synced!</h2>
        <button
          onClick={closeSuccessModal}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
        >
          OK
        </button>
      </Modal> */}
    </>
  );
};

export default SIWE;
