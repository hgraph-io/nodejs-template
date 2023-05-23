import Client, {createJws, verifyJws} from '@hgraph.io/sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const subscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const client = new Client()

async function main() {
  // create a JWS token
  const jws = await createJws(
    process.env.HEDERA_ACCOUNT_PRIVATE_KEY,
    process.env.HEDERA_ACCOUNT_PUBLIC_KEY,
    {
      claims: {'urn:example:claim': true},
      audience: 'https://hgraph.me',
      expirationTime: '1h',
      issuer: process.env.HEDERA_ACCOUNT_ID,
    }
  )

  console.log(await verifyJws(jws, process.env.HEDERA_ACCOUNT_PUBLIC_KEY))

//   const unsubscribe = client.subscribe(subscription, {
//     // handle the data
//     next: (data) => {
//       console.dir(data, {depth: null})
//     },
//     error: (e) => {
//       console.error(e)
//     },
//     complete: () => {
//       console.log('Optionally do some cleanup')
//     },
//   })

//   // clear subscription
//   setTimeout(unsubscribe, 6000)
}

main()
