export function secondsSinceConsensus(
  consensusTimestamp: bigint,
  now: bigint = BigInt(Date.now()),
): bigint {
  const diff = (now - consensusTimestamp / 1000000n) / 1000n
  if (diff < 0n) {
    return 0n
  }
  return diff
}
