// @ts-nocheck
import { jest } from '@jest/globals'

const erc20Mock = {
  name: jest.fn<Promise<string>, []>().mockResolvedValue('Token20'),
  symbol: jest.fn<Promise<string>, []>().mockResolvedValue('T20'),
  decimals: jest.fn<Promise<number>, []>().mockResolvedValue(18),
  balanceOf: jest.fn<Promise<bigint>, [string]>().mockResolvedValue(1000n),
}

const erc721Mock = {
  name: jest.fn<Promise<string>, []>().mockResolvedValue('Token721'),
  symbol: jest.fn<Promise<string>, []>().mockResolvedValue('T721'),
  ownerOf: jest.fn<Promise<string>, [bigint]>().mockResolvedValue('0xowner'),
  tokenURI: jest
    .fn<Promise<string>, [bigint]>()
    .mockResolvedValue('https://token.uri/1'),
}

jest.mock('@hgraph.io/sdk', () => ({
  ERC20: jest.fn(() => erc20Mock),
  ERC721: jest.fn(() => erc721Mock),
}))

import { showTokenInfo } from '../src/tokenInfo'

describe('showTokenInfo', () => {
  it('logs token information', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await showTokenInfo()
    expect(logSpy).toHaveBeenCalledWith('ERC20 Token:', {
      name: 'Token20',
      symbol: 'T20',
      decimals: 18,
      balanceOfZero: 1000n,
    })
    expect(logSpy).toHaveBeenCalledWith('ERC721 Token:', {
      name: 'Token721',
      symbol: 'T721',
      ownerOf1: '0xowner',
      tokenURI1: 'https://token.uri/1',
    })
    logSpy.mockRestore()
  })
})
