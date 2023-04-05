import hg from '@hgraph.io/sdk'
import * as dotenv from 'dotenv'
dotenv.config()

const subscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

async function main() {
  const unsubscribe = await hg(subscription, {
    // The client supports filtering the response date using jmespath -  https://jmespath.org/
    filter: 'data.transaction[0].consensus_timestamp',
    // handle the data
    next: (data: bigint) => {
      const diff = (BigInt(new Date().getTime()) - data / 1000000n) / 1000n
      console.log(`consensus_timestamp was about ${diff} seconds ago`)
    },
    error: (e: string) => {
      console.error(e)
    },
    complete: () => {
      console.log('Optionally do some cleanup')
    },
    headers: {
      'x-api-key': process.env.HGRAPH_API_KEY,
    },
  })

  // clear subscription
  setTimeout(unsubscribe, 6000)
}

main()
