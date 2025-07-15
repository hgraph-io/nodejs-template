import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

import { main as latestTransactionDemo } from './index'
import { showTokenInfo } from './tokenInfo'
import { demoWrappers } from './ercWrappersDemo'

interface Example {
  name: string
  description: string
  run: () => Promise<void> | void
}

const examples: Example[] = [
  {
    name: 'Latest Transaction',
    description:
      'Subscribe to the most recent transaction and print how long ago it occurred.',
    run: latestTransactionDemo,
  },
  {
    name: 'Token Information',
    description: 'Read ERC-20 and ERC-721 token details from the network.',
    run: showTokenInfo,
  },
  {
    name: 'ERC Wrapper Demo',
    description:
      'Invoke common functions of the ERC20 and ERC721 wrapper classes.',
    run: demoWrappers,
  },
]

async function askYesNo(
  rl: readline.Interface,
  prompt: string,
): Promise<boolean> {
  const answer = (await rl.question(`${prompt} (y/n) `)).trim().toLowerCase()
  return answer === 'y'
}

export async function runCli(): Promise<void> {
  const rl = readline.createInterface({ input, output })

  for (const ex of examples) {
    console.log(`\n${ex.name}\n  ${ex.description}`)
    if (await askYesNo(rl, 'Run this demo?')) {
      await ex.run()
    }
  }

  rl.close()
}

if (require.main === module) {
  runCli().catch((e) => console.error(e))
}

