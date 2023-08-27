import '@styles/globals.scss';

import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { AppHead } from '@components/common/app-head';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ethereumClient, projectId, wagmiConfig } from '@lib/web3/config';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps
}: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <AppHead />
        <AuthContextProvider>
          <ThemeContextProvider>
            {getLayout(<Component {...pageProps} />)}
          </ThemeContextProvider>
        </AuthContextProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
