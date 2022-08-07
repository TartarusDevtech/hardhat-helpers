import hre from "hardhat";
import { Context } from "mocha";

export function snapshotEach(funcBeforeSnapshot: (this: Context) => Promise<void>): void {
  let snapshotId: string;

  before(async function () {
    await funcBeforeSnapshot.call(this);
    snapshotId = await hre.network.provider.send("evm_snapshot", []);
  });

  beforeEach(async function () {
    await hre.network.provider.send("evm_revert", [snapshotId]);
    snapshotId = await hre.network.provider.send("evm_snapshot", []);
  });

  after(async function () {
    // Clean up state when tests finish
    await hre.network.provider.send("evm_revert", [snapshotId]);
  });
}
