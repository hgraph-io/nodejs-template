/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { jest } from '@jest/globals'
import { detectContractType, showContractTypeDemo } from '../src/contractType'
import { detectContractType as sdkDetectContractType } from '@hgraph.io/sdk'

jest.mock('@hgraph.io/sdk', () => ({
  detectContractType: jest.fn(),
}))

describe('detectContractType', () => {
  it('re-exports the SDK implementation', () => {
    expect(detectContractType).toBe(sdkDetectContractType)
  })
})

describe('showContractTypeDemo', () => {
  const fetchMock = jest.fn() as unknown as jest.Mock

  beforeEach(() => {
    // @ts-ignore
    global.fetch = fetchMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('downloads token lists and logs detected types', async () => {
    ;(fetchMock as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => [{ address: '0x1' }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ address: '0x2' }] })

    ;(detectContractType as jest.Mock)
      .mockResolvedValueOnce('erc20')
      .mockResolvedValueOnce('erc721')

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await showContractTypeDemo()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(detectContractType).toHaveBeenCalledWith('0x1', expect.anything())
    expect(detectContractType).toHaveBeenCalledWith('0x2', expect.anything())
    expect(logSpy).toHaveBeenCalledWith('0x1 -> erc20')
    expect(logSpy).toHaveBeenCalledWith('0x2 -> erc721')

    logSpy.mockRestore()
  })
})
