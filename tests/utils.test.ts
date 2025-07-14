import { secondsSinceConsensus } from '../src/utils'

describe('secondsSinceConsensus', () => {
  it('uses the current time when now is omitted', () => {
    const consensus = 0n
    // freeze Date.now to a predictable value
    const spy = jest.spyOn(global.Date, 'now').mockReturnValue(5000)
    expect(secondsSinceConsensus(consensus)).toBe(5n)
    spy.mockRestore()
  })
  it('calculates the difference in seconds', () => {
    const now = 2000n
    const consensus = 1000000000n
    expect(secondsSinceConsensus(consensus, now)).toBe(1n)
  })

  it('returns zero when consensus timestamp is in the future', () => {
    const now = 1000n
    const consensus = 3000000000n
    expect(secondsSinceConsensus(consensus, now)).toBe(0n)
  })
})
