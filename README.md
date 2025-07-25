# Getting started

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and provide your HGraph API key:
   ```bash
   cp .env.example .env
   # Edit .env and replace <YOUR_API_KEY> with your key
   ```

## Building
Compile the TypeScript source into the `dist` directory:
```bash
npm run build
```

## Running the application
Execute the compiled code directly:
```bash
node dist/index.js
# or
npm run start
```
When successful you should see output similar to:
```
consensus_timestamp was about <seconds> seconds ago
```

## Environment variables
- `HGRAPH_API_KEY` – your API key used by the GraphQL client. This value is
  loaded from `.env` at runtime.

## GraphQL client usage
`src/index.ts` demonstrates subscribing to the latest transaction using
`@hgraph.io/sdk`:
```ts
const LatestTransactionSubscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const subscription = client.subscribe(LatestTransactionSubscription, {
  next: ({ data }) => {
    const { consensus_timestamp } = data.transaction[0]
    const diff = secondsSinceConsensus(consensus_timestamp, BigInt(Date.now()))
    console.log(`consensus_timestamp was about ${diff} seconds ago`)
  }
})
```
If you encounter connection errors ensure the API key is valid and that your
network allows outbound connections to HGraph.

## Detecting contract type
`src/contractType.ts` shows how to determine if a contract address implements the ERC-20 or ERC-721 interface using ethers. The exported `detectContractType` function returns `"erc20"`, `"erc721"`, or `"unknown"`.
The file also contains `showContractTypeDemo` which downloads token lists from the
[Hiero Mirror Node Explorer](https://github.com/hiero-ledger/hiero-mirror-node-explorer/tree/3be93c1b1172610a539f2d9379c849113d987a85/public/mainnet)
repository and prints the detected type of a couple of sample addresses.

Run the demo with:
```bash
npm run demo:contractType
```

## ERC wrapper examples
Run the following command to build the project and execute a script demonstrating every function in the ERC20 and ERC721 wrappers:
```bash
npm run start:wrappers
```
The script `src/ercWrappersDemo.ts` shows how to read token information and invoke transfer functions using an ethers `Wallet`.
