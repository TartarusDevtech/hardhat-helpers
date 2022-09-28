import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { getEvent, snapshotEach } from "../../../src";
import { MockEvent, MockEvent__factory, MockEvents, MockEvents__factory, Multicall__factory } from "../../typechain";
import { EventEvent } from "../../typechain/contracts/MockEvent";
import { MultipleEvent } from "../../typechain/contracts/MockEvents";

describe("expectAllEvents / expectEvents", () => {
  let mockEvent: MockEvent;
  let mockEvents: MockEvents;

  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;

  let tx: ContractTransaction;

  snapshotEach(async () => {
    [alice, bob, charlie] = await ethers.getSigners();
    mockEvent = await new MockEvent__factory(alice).deploy();
    mockEvents = await new MockEvents__factory(alice).deploy();
  });

  describe("Single event", () => {
    snapshotEach(async () => {
      tx = await mockEvent.emitEvent();
    });

    it("getEvent from contract", async () => {
      const event = await getEvent<EventEvent>(tx, mockEvent, mockEvent.interface.events["Event()"]);
      expect(event.event).to.eq("Event");
    });

    it("getEvent from factory", async () => {
      const factory = new MockEvent__factory();
      const event = await getEvent<EventEvent>(tx, factory, factory.interface.events["Event()"]);
      expect(event.event).to.eq("Event");
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

    describe("Event from an external contract", () => {
      snapshotEach(async () => {
        const proxy = await new Multicall__factory(alice).deploy();
        const data = (await mockEvents.populateTransaction.emitMultiple(...args)).data;
        if (!data) throw new Error("No data");
        tx = await proxy.call([{ to: mockEvents.address, data }]);
      });

      it("getEvent from contract", async () => {
        const event = await getEvent<MultipleEvent>(
          tx,
          mockEvent,
          mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"]
        );
        expect(event.args.str).to.eq(str);
      });
    });
  });
});
