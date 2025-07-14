import { jest } from '@jest/globals'

// Mock dotenv to avoid loading environment variables during tests
jest.mock('dotenv', () => ({ config: jest.fn() }))

const unsubscribeMock = jest.fn()
const subscribeMock = jest.fn()

// Mock the SDK client
jest.mock('@hgraph.io/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    subscribe: subscribeMock,
    headers: {},
  })),
}))

// Mock utils to control the returned diff value
jest.mock('../src/utils', () => ({
  secondsSinceConsensus: jest.fn(() => 5n),
}))

import { main } from '../src/index'
import { secondsSinceConsensus } from '../src/utils'

describe('main', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribeMock.mockImplementation((_query: any, handlers: any) => {
      // immediately call next and error/complete callbacks to cover branches
      handlers.next({ data: { transaction: [{ consensus_timestamp: 1000n }] } })
      handlers.error(new Error('boom'))
      handlers.complete()
      return { unsubscribe: unsubscribeMock }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it('handles subscription events and schedules unsubscribe', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    main()

    expect(subscribeMock).toHaveBeenCalled()
    expect(secondsSinceConsensus).toHaveBeenCalledWith(
      1000n,
      expect.any(BigInt),
    )
    expect(logSpy).toHaveBeenCalledWith(
      'consensus_timestamp was about 5 seconds ago',
    )
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error))

    jest.runAllTimers()
    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('runs automatically when NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'production'
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../src/index')
    })
    expect(subscribeMock).toHaveBeenCalled()
    process.env.NODE_ENV = 'test'
  })
})
