import hre from "hardhat";
import { Context } from "mocha";

export function snapshotEach(funcBeforeSnapshot: (this: Context) => Promise<void>): void {
  let snapshotId: string;

  beforeEach(async function () {
    if (!snapshotId) {
      // First run only
      await funcBeforeSnapshot.call(this);
    }

    // A new snapshot is required after each revert
    snapshotId = await hre.network.provider.send("evm_snapshot", []);
  });

  afterEach(async function () {
    // Clean up state when tests finish
    await hre.network.provider.send("evm_revert", [snapshotId]);
  });
}
