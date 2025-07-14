export function secondsSinceConsensus(consensusTimestamp: bigint, now: bigint = BigInt(Date.now())): bigint {
  return (now - consensusTimestamp / 1000000n) / 1000n;
}
