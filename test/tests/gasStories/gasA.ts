import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { snapshotEach } from "../../../src";
import { gasStory } from "../../../src/gasStories";
import { MockEvent, MockEvent__factory } from "../../typechain";

describe("gasStories / gasA", () => {
  let mockEvent: MockEvent;
  let alice: SignerWithAddress;
  let tx: ContractTransaction;

  snapshotEach(async () => {
    [alice] = await ethers.getSigners();
    mockEvent = await new MockEvent__factory(alice).deploy();
  });

  it("Record", async () => {
    tx = await mockEvent.emitEvent();
    await gasStory(tx, "MockEvent", "emitEvent");
    const events: ContractTransaction[] = [];
    for (let i = 0; i < 20; i++) {
      events.push(tx);
    }
    await gasStory([...events, ...events], "MockEvent", "emitEvent big");
    await gasStory(events, "MockEvent", "emitEvent again");
    for (let i = 0; i < 400; i++) {
      events.push(tx);
    }
    await gasStory(events, "MockEvent", "emitEvent huge");
  });
  it("Record", async () => {
    tx = await mockEvent.emitEvent();
    await gasStory([tx, tx], "MockEvent", "emitEvent2", "okay");
  });
  it("Record", async () => {
    tx = await mockEvent.emitEvent();
    await gasStory([tx, tx, tx, tx], "MockEvent", "emitEvent2", "deep", "example3");
    await gasStory([tx], "MockEvent", "emitEvent2", "deep", "example2");
    await gasStory([tx, tx, tx], "MockEvent", "emitEvent2", "deep", "example");
  });
});
