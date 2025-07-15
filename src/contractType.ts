import { detectContractType } from '@hgraph.io/sdk'
import { JsonRpcProvider } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const provider = new JsonRpcProvider(
  `https://${process.env.HGRAPH_NETWORK}.hedera.api.hgraph.dev/v1/${process.env.HGRAPH_API_KEY}/rpc`,
)

const ERC20_JSON_URL =
  'https://raw.githubusercontent.com/hiero-ledger/hiero-mirror-node-explorer/3be93c1b1172610a539f2d9379c849113d987a85/public/mainnet/erc-20.json'
const ERC721_JSON_URL =
  'https://raw.githubusercontent.com/hiero-ledger/hiero-mirror-node-explorer/3be93c1b1172610a539f2d9379c849113d987a85/public/mainnet/erc-721.json'

async function firstAddress(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`)
  }
  const list = (await res.json()) as Array<{ address: string }>
  return list[0].address
}

export async function showContractTypeDemo(): Promise<void> {
  const erc20Addr = await firstAddress(ERC20_JSON_URL)
  const erc721Addr = await firstAddress(ERC721_JSON_URL)

  for (const address of [erc20Addr, erc721Addr]) {
    const type = await detectContractType(address, provider)
    console.log(`${address} -> ${type}`)
  }
}

if (require.main === module) {
  showContractTypeDemo().catch((e) => console.error(e))
}

export { detectContractType }
export type { ContractType } from '@hgraph.io/sdk'
