# SPRENS

Twitter clone where users are ENS holders, and all data is stored with Spruce Storage Module. Data includes tweets, follows, likes, and block lists.

## Pitch / Demo video

https://www.loom.com/share/c7dd2b9d45d14dd8905aae036392b1b5?sid=ece6639f-624c-4f18-8d4a-84a3571c0bcf


## Why use ENS?

With data being tied to ENS holders, transfers of the ENS NFT will naturally transfer ownership of these personal data. Some use-cases include: build on-chain legacy (instead of just buys/sells), true-r sense of ownership of NFT, etc.

## Difference with Farcaster dApps

Instead of relying on [Hubs](https://docs.farcaster.xyz/protocol/hubs.html), users can choose which [Peers](https://www.sprucekit.dev/kepler/kepler) they wish to use when storing data.

# Future Extensions

- Create [Token-bound Account](https://tokenbound.org/) using ENS NFT, and derive identity based off of the ERC6551 Account
  - Store all decentralized protocol NFTs (incl. cross-chain) and change identity whenever (think switching accounts in wallet provider)
- Build public API for a Token-bound Account's on-chain social activity

## Acknowledgements

- With help from https://github.dev/spruceid/teal
- Starter project build with https://github.com/ccrsxx/twitter-clone
