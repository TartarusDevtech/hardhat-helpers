import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { EventLog, expectAllEvents, snapshotEach, getEvent } from "../../../src";
import {
  MockEvent,
  MockEvents,
  MockEvents__factory,
  MockEvent__factory,
  Multicall,
  Multicall__factory,
} from "../../typechain";
import { EventEvent } from "../../typechain/MockEvent";
import { MultipleEvent } from "../../typechain/MockEvents";

describe("expectAllEvents / expectEvents", () => {
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

  describe("Single event", () => {
    snapshotEach(async () => {
      tx = await mockEvent.emitEvent();
    });

    it("getEvent", async () => {
      const event = await getEvent<EventEvent>(tx, mockEvent, mockEvent.interface.events["Event()"]);
      console.log(event);
    });
  });

  describe("Single complex event", () => {
    const value = 42;
    const str = "Hello World";
    const data = "0x1234567890";
    let args: [string, string, string, BigNumberish, string, string];

    beforeEach(async () => {
      args = [alice.address, bob.address, charlie.address, value, str, data];
    });

    snapshotEach(async () => {
      tx = await mockEvents.emitMultiple(...args);
    });

    it("getEvent", async () => {
      const event = await getEvent<MultipleEvent>(
        tx,
        mockEvents,
        mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"]
      );
      expect(event.args.str).to.eq(str);
    });
  });
});
