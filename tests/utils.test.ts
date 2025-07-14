import { secondsSinceConsensus } from '../src/utils'

describe('secondsSinceConsensus', () => {
  it('calculates the difference in seconds', () => {
    const now = 2000n
    const consensus = 1000000000n
    expect(secondsSinceConsensus(consensus, now)).toBe(1n)
  })
})
