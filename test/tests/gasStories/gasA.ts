import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { snapshotEach } from "../../../src";
import { gasStory } from "../../../src/gasStories";
import {
  MockEvent,
  MockEvents,
  MockEvents__factory,
  MockEvent__factory,
  Multicall,
  Multicall__factory,
} from "../../typechain";

describe("gasStories / gasA", () => {
  let mockEvent: MockEvent;
  let mockEvents: MockEvents;
  let multicall: Multicall;

  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;

  let tx: ContractTransaction;

  snapshotEach(async () => {
    [alice, bob, charlie] = await ethers.getSigners();
    mockEvent = await new MockEvent__factory(alice).deploy();
    mockEvents = await new MockEvents__factory(alice).deploy();
    multicall = await new Multicall__factory(alice).deploy();
  });

  it("Record", async () => {
    tx = await mockEvent.emitEvent();
    await gasStory(tx, "MockEvent", "emitEvent");
    let events: ContractTransaction[] = [];
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
