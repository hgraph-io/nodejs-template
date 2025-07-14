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

## Watch mode
The project includes a convenience watcher that rebuilds on change and serves
`dist` using `serve` while watching files with `nodemon`:
```bash
npm run watch
```
During watch mode `serve` prints the local URL (default is
`http://localhost:3000`) and `nodemon` logs rebuild messages whenever source
files are updated.

If the command fails with `serve: command not found` install it globally or run
`npx serve`.

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
