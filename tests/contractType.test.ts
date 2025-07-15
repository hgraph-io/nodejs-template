import { detectContractType } from '../src/contractType'
import { detectContractType as sdkDetectContractType } from '@hgraph.io/sdk'

describe('detectContractType', () => {
  it('re-exports the SDK implementation', () => {
    expect(detectContractType).toBe(sdkDetectContractType)
  })
})
