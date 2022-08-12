import hre from "hardhat";
import { Context } from "mocha";

let deploySnapshotId: string;
let deployer: (this: Context) => Promise<void> | undefined;

export function registerSnapshotDeploy(funcBeforeSnapshot: (this: Context) => Promise<void>): void {
  deployer = funcBeforeSnapshot;
}

export function snapshotEach(funcBeforeSnapshot: (this: Context) => Promise<void>): void {
  let snapshotId: string;

  before(async function () {
    if (!deploySnapshotId && deployer) {
      // First run only
      await deployer.call(this);
      deploySnapshotId = await hre.network.provider.send("evm_snapshot", []);
    }
  });

  beforeEach(async function () {
    if (!snapshotId) {
      // First run only
      await funcBeforeSnapshot.call(this);
      snapshotId = await hre.network.provider.send("evm_snapshot", []);
    }
  });

  afterEach(async function () {
    // Clean up state when tests finish
    await hre.network.provider.send("evm_revert", [snapshotId]);
    // A new snapshot is required after each revert
    snapshotId = await hre.network.provider.send("evm_snapshot", []);
  });

  after(async function () {
    // Clean up state when tests finish
    if (deploySnapshotId) {
      await hre.network.provider.send("evm_revert", [deploySnapshotId]);

      // A new snapshot is required after each revert
      deploySnapshotId = await hre.network.provider.send("evm_snapshot", []);
    }
  });
}
