// @ts-nocheck
import { jest } from '@jest/globals'

const supportsInterfaceMock: jest.Mock = jest.fn()
const decimalsMock: jest.Mock = jest.fn()

jest.mock('ethers', () => ({
  Contract: jest.fn(() => ({
    supportsInterface: supportsInterfaceMock,
    decimals: decimalsMock,
  })),
  JsonRpcProvider: jest.fn(),
}))

import { detectContractType } from '../src/contractType'
import { JsonRpcProvider } from 'ethers'

describe('detectContractType', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('identifies ERC721 via supportsInterface', async () => {
    supportsInterfaceMock.mockResolvedValueOnce(true)
    const provider = new JsonRpcProvider('')
    await expect(detectContractType('0x', provider)).resolves.toBe('erc721')
    expect(supportsInterfaceMock).toHaveBeenCalledWith('0x80ac58cd')
    expect(decimalsMock).not.toHaveBeenCalled()
  })

  it('identifies ERC20 via decimals when ERC721 check fails', async () => {
    supportsInterfaceMock.mockRejectedValueOnce(new Error('fail'))
    decimalsMock.mockResolvedValueOnce(18)
    const provider = new JsonRpcProvider('')
    await expect(detectContractType('0x', provider)).resolves.toBe('erc20')
    expect(decimalsMock).toHaveBeenCalled()
  })

  it('returns unknown when checks fail', async () => {
    supportsInterfaceMock.mockRejectedValueOnce(new Error('fail'))
    decimalsMock.mockRejectedValueOnce(new Error('fail'))
    const provider = new JsonRpcProvider('')
    await expect(detectContractType('0x', provider)).resolves.toBe('unknown')
  })
})
