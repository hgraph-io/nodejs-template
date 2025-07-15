import { jest } from '@jest/globals'
jest.mock('node:readline/promises', () => ({
  createInterface: jest.fn(),
}))
import * as readline from 'node:readline/promises'

jest.mock('../src/index', () => ({ main: jest.fn() }))
jest.mock('../src/tokenInfo', () => ({ showTokenInfo: jest.fn() }))
jest.mock('../src/ercWrappersDemo', () => ({ demoWrappers: jest.fn() }))

import { main as latestTransactionDemo } from '../src/index'
import { showTokenInfo } from '../src/tokenInfo'
import { demoWrappers } from '../src/ercWrappersDemo'
import { runCli } from '../src/cli'

describe('runCli', () => {
  it('waits for user input before running demos', async () => {
    const question = jest.fn<(query: string) => Promise<string>>()
      .mockResolvedValueOnce('y')
      .mockResolvedValueOnce('n')
      .mockResolvedValueOnce('y')
    const rl = { question, close: jest.fn() } as unknown as readline.Interface
    ;(readline.createInterface as jest.Mock).mockReturnValue(rl)

    await runCli()

    expect(question).toHaveBeenCalledTimes(3)
    expect(latestTransactionDemo).toHaveBeenCalledTimes(1)
    expect(showTokenInfo).not.toHaveBeenCalled()
    expect(demoWrappers).toHaveBeenCalledTimes(1)
    expect(rl.close).toHaveBeenCalled()
  })
})
