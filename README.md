# hardhat-helpers

Test helpers for Hardhat.

`yarn add hardhat-helpers`

## Snapshot Each

Replaces the first `beforeEach` in a test file to improve performance similar to Hardhat's fixtures -- but with a more familiar syntax.

Example:

```typescript
import { snapshotEach } from 'hardhat-helpers'

let someContract

snapshotEach(async () => {
  someContract = await deployContract()
})

it('Test like normal', async () => {
  expect(await someContract.method()).toEqual(42)
})

it('Next test reuses the original deployment', async () => {
  expect(await someContract.otherMethod()).toEqual(69)
})
```

It runs like normal for the first test, and then each additional test rolls back the node instead of redeploying.

## Expect All Events

Checks the tx for the exact logs specified including order, count, and args.

```typescript
import { expectAllEvents } from 'hardhat-helpers'

it('Emits', async () => {
  const tx = await magicContract.magic()
  await expectAllEvents(tx, [
    {
      contract: magicContract,
      event: 'MagicStarted',
      args: [42],
    },
    {
      contract: magicContract,
      event: 'MagicHappened',
      args: [69],
    },
  ])
})
```

## Time Travel

Simple helpers to modify the block time in tests. Several variations are supported: see [time.ts](./src/time.ts) for a complete list.

```typescript
import { increaseTime } from 'hardhat-helpers'

it('Do something later', async () => {
  await timeContract.queue()
  await increaseTime(10) // in seconds
  await timeContract.process()
})
```

## And more...

TODO: more docs

- [balance](./src/balance.ts)
- [storage](./src/storage.ts)
