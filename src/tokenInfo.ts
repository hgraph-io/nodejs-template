import { ERC20, ERC721 } from '@hgraph.io/sdk'
import { JsonRpcProvider } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const provider = new JsonRpcProvider(
  `https://${process.env.HGRAPH_NETWORK}.hedera.api.hgraph.dev/v1/${process.env.HGRAPH_API_KEY}/rpc`,
)

const ERC20_ADDRESS = '0x49bce6adea59ce638ef15808dbc63503845c0c85'
const ERC721_ADDRESS = '0xf83ea5628dedcc245f7896807d6bb098b98fbcf9'

export async function showTokenInfo(): Promise<void> {
  const erc20 = new ERC20(ERC20_ADDRESS, provider)
  const erc721 = new ERC721(ERC721_ADDRESS, provider)

  const erc20Info = {
    name: await erc20.name(),
    symbol: await erc20.symbol(),
    decimals: await erc20.decimals(),
    balanceOfZero: await erc20.balanceOf(
      '0x0000000000000000000000000000000000000000',
    ),
  }

  const erc721Info = {
    name: await erc721.name(),
    symbol: await erc721.symbol(),
    ownerOf1: await erc721.ownerOf(1n),
    tokenURI1: await erc721.tokenURI(1n),
  }

  console.log('ERC20 Token:', erc20Info)
  console.log('ERC721 Token:', erc721Info)
}

if (require.main === module) {
  showTokenInfo().catch((e) => console.error(e))
}
