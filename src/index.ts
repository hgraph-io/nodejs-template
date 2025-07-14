import Client from '@hgraph.io/sdk'
import * as dotenv from 'dotenv'
import { secondsSinceConsensus } from './utils'
dotenv.config()

const client = new Client()

client.headers = {
  'x-api-key': process.env.HGRAPH_API_KEY,
}

const LatestTransactionSubscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

async function main() {
  const subscription = client.subscribe(LatestTransactionSubscription, {
    // handle the data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: ({ data }: any) => {
      const { consensus_timestamp } = data.transaction[0]
      const diff = secondsSinceConsensus(
        consensus_timestamp,
        BigInt(new Date().getTime()),
      )
      console.log(`consensus_timestamp was about ${diff} seconds ago`)
    },
    error: (e) => {
      console.error(e)
    },
    complete: () => {
      console.log('Optionally do some cleanup')
    },
  })

  // clear subscription
  setTimeout(subscription.unsubscribe, 6000)
}

main()
