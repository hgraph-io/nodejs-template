import { ERC20, ERC721 } from '@hgraph.io/sdk'
import { JsonRpcProvider, Wallet } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const provider = new JsonRpcProvider(
  `https://${process.env.HGRAPH_NETWORK}.hedera.api.hgraph.dev/v1/${process.env.HGRAPH_API_KEY}/rpc`,
)

const ERC20_ADDRESS = '0x49bce6adea59ce638ef15808dbc63503845c0c85'
const ERC721_ADDRESS = '0xf83ea5628dedcc245f7896807d6bb098b98fbcf9'

export async function demoWrappers(): Promise<void> {
  // use a wallet so that transfer functions can be invoked
  const wallet = new Wallet(
    process.env.PRIVATE_KEY ?? Wallet.createRandom().privateKey,
    provider,
  )

  const erc20 = new ERC20(ERC20_ADDRESS, wallet)
  const erc721 = new ERC721(ERC721_ADDRESS, wallet)

  console.log('ERC20 name:', await erc20.name())
  console.log('ERC20 symbol:', await erc20.symbol())
  console.log('ERC20 decimals:', await erc20.decimals())
  console.log('ERC20 balanceOf:', await erc20.balanceOf(wallet.address))

  try {
    const tx = await erc20.transfer(wallet.address, 1n)
    console.log('ERC20 transfer hash:', tx.hash)
  } catch (e) {
    console.error('ERC20 transfer failed:', (e as Error).message)
  }

  try {
    const tx = await erc20.transferFrom(wallet.address, wallet.address, 1n)
    console.log('ERC20 transferFrom hash:', tx.hash)
  } catch (e) {
    console.error('ERC20 transferFrom failed:', (e as Error).message)
  }

  console.log('ERC721 name:', await erc721.name())
  console.log('ERC721 symbol:', await erc721.symbol())
  try {
    console.log('ERC721 ownerOf token 1:', await erc721.ownerOf(1n))
    console.log('ERC721 tokenURI for token 1:', await erc721.tokenURI(1n))
  } catch (e) {
    console.error('ERC721 read failed:', (e as Error).message)
  }

  try {
    const tx = await erc721.transferFrom(wallet.address, wallet.address, 1n)
    console.log('ERC721 transferFrom hash:', tx.hash)
  } catch (e) {
    console.error('ERC721 transferFrom failed:', (e as Error).message)
  }

  try {
    const tx = await erc721.safeTransferFrom(wallet.address, wallet.address, 1n)
    console.log('ERC721 safeTransferFrom hash:', tx.hash)
  } catch (e) {
    console.error('ERC721 safeTransferFrom failed:', (e as Error).message)
  }
}

if (require.main === module) {
  demoWrappers().catch((e) => console.error(e))
}
