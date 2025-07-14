// @ts-nocheck
import { jest } from '@jest/globals'

const erc20Mock = {
  name: jest.fn<Promise<string>, []>().mockResolvedValue('Token20'),
  symbol: jest.fn<Promise<string>, []>().mockResolvedValue('T20'),
  decimals: jest.fn<Promise<number>, []>().mockResolvedValue(18),
}

const erc721Mock = {
  name: jest.fn<Promise<string>, []>().mockResolvedValue('Token721'),
  symbol: jest.fn<Promise<string>, []>().mockResolvedValue('T721'),
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
    })
    expect(logSpy).toHaveBeenCalledWith('ERC721 Token:', {
      name: 'Token721',
      symbol: 'T721',
    })
    logSpy.mockRestore()
  })
})
