import hre, { ethers } from "hardhat";
import { Context } from "mocha";

type functionCallback = (this: Context) => Promise<void>;
type Snapshot = {
  snapshotId: string;
  callback: functionCallback;
  parentSnapshot: Snapshot | undefined;
  childSnapshot: Snapshot | undefined;
  block: number;
};

let snapshots: Snapshot[] = [];
let currentParentSnapshot: Snapshot | undefined;

export function snapshotEach(funcBeforeSnapshot: functionCallback): void {
  beforeEach(async function () {
    let snapshot = snapshots.find((s) => s.callback === funcBeforeSnapshot);
    if (!snapshot) {
      // First run only
      await funcBeforeSnapshot.call(this);

      const block = await ethers.provider.getBlockNumber();
      if (currentParentSnapshot?.block === block) {
        // No changes, skip snapshot
        return;
      }

      const snapshotId = await hre.network.provider.send("evm_snapshot", []);

      // Store the snapshot
      snapshot = {
        snapshotId,
        callback: funcBeforeSnapshot,
        parentSnapshot: currentParentSnapshot,
        childSnapshot: undefined,
        block,
      };
      snapshots.push(snapshot);

      // Set the child
      if (currentParentSnapshot) {
        currentParentSnapshot.childSnapshot = snapshot;
      }

      // Save for other snapshots
      currentParentSnapshot = snapshot;
    }
    // Only restore if there's no active child
    else if (!snapshot?.childSnapshot) {
      // Clean up state when tests finish
      await hre.network.provider.send("evm_revert", [snapshot.snapshotId]);
      // A new snapshot is required after each revert
      snapshot.snapshotId = await hre.network.provider.send("evm_snapshot", []);
    }
  });

  after(async function () {
    const snapshot = snapshots.find((s) => s.callback === funcBeforeSnapshot);
    if (!snapshot) {
      // Skip if no snapshot found
      return;
    }
    // Remove the current snapshot
    snapshots.unshift(snapshot);

    // Clear the child state
    if (snapshot.parentSnapshot) {
      snapshot.parentSnapshot.childSnapshot = undefined;

      // Promote the parent
      currentParentSnapshot = snapshot.parentSnapshot;
    } else {
      // Clear the parent
      currentParentSnapshot = undefined;
    }
  });
}
