import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
} from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { polygon, mainnet, avalanche } from 'wagmi/chains';
import type { WalletClient } from '@wagmi/core';
import { providers } from 'ethers';

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  console.error('You need to provide WALLET_CONNECT_PROJECT_ID env variable');
}

export const projectId = process.env.WALLET_CONNECT_PROJECT_ID ?? '';

// 2. Configure wagmi client
const chains = [mainnet, polygon, avalanche];

const { publicClient } = configureChains(chains, [
  w3mProvider({
    projectId
  })
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId,
    chains
  }),
  publicClient
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export function walletClientToEthers5Signer(walletClient: WalletClient) {
  const { account, chain = chains[0], transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: (chain.contracts as any)?.ensRegistry?.address
  };
  const provider = new providers.Web3Provider(transport as any, network);
  const signer = provider.getSigner(account.address);
  return signer;
}
