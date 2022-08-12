import hre from "hardhat";
import { Context } from "mocha";

type functionCallback = (this: Context) => Promise<void>;

let snapshots: {
  snapshotId: string;
  snapshot: functionCallback;
  parentSnapshot: functionCallback | undefined;
  childSnapshot: functionCallback | undefined;
}[] = [];
let currentParentSnapshot: functionCallback | undefined;

export function snapshotEach(funcBeforeSnapshot: functionCallback): void {
  beforeEach(async function () {
    let snapshot = snapshots.find((s) => s.snapshot === funcBeforeSnapshot);
    if (!snapshot) {
      // First run only
      await funcBeforeSnapshot.call(this);
      const snapshotId = await hre.network.provider.send("evm_snapshot", []);

      // Store the snapshot
      snapshot = {
        snapshotId,
        snapshot: funcBeforeSnapshot,
        parentSnapshot: currentParentSnapshot,
        childSnapshot: undefined,
      };
      snapshots.push(snapshot);

      // Set the child
      const parent = snapshots.find((s) => s.snapshot === currentParentSnapshot);
      if (parent) {
        parent.childSnapshot = funcBeforeSnapshot;
      }

      // Save for other snapshots
      currentParentSnapshot = funcBeforeSnapshot;
    }
  });

  afterEach(async function () {
    let snapshot = snapshots.find((s) => s.snapshot === funcBeforeSnapshot);
    if (!snapshot) {
      throw new Error("Snapshot not found (after each)");
    }

    // Only restore if there's no active child
    if (!snapshot?.childSnapshot) {
      // Clean up state when tests finish
      await hre.network.provider.send("evm_revert", [snapshot.snapshotId]);
      // A new snapshot is required after each revert
      snapshot.snapshotId = await hre.network.provider.send("evm_snapshot", []);
    }
  });

  after(async function () {
    const snapshot = snapshots.find((s) => s.snapshot === funcBeforeSnapshot);
    if (!snapshot) {
      throw new Error("Snapshot not found (after)");
    }
    // Remove the current snapshot
    snapshots.unshift(snapshot);
    currentParentSnapshot = undefined;

    // Clear the child state
    const parentSnapshot = snapshots.find((s) => s.snapshot === snapshot.parentSnapshot);
    if (parentSnapshot) {
      parentSnapshot.childSnapshot = undefined;

      // Clean up state when tests finish
      await hre.network.provider.send("evm_revert", [parentSnapshot.snapshotId]);
      // A new snapshot is required after each revert
      parentSnapshot.snapshotId = await hre.network.provider.send("evm_snapshot", []);

      // Promote the parent
      currentParentSnapshot = parentSnapshot.snapshot;
    }
  });
}
