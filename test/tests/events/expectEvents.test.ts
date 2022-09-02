import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumberish, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { expectAllEvents, snapshotEach } from "../../../src";
import {
  MockEvent,
  MockEvent__factory,
  MockEvents,
  MockEvents__factory,
  Multicall,
  Multicall__factory,
} from "../../typechain";

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

  describe("No events", () => {
    snapshotEach(async () => {
      tx = await mockEvent.noop();
    });

    it("Test events", async () => {
      await expectAllEvents(tx, []);
    });

    it("Fails with other events", async () => {
      await expect(
        expectAllEvents(tx, [{ contract: mockEvent, event: mockEvent.interface.events["Event()"], args: [] }])
      ).to.be.rejectedWith("Log count mismatch");
    });
  });

  describe("Single event", () => {
    snapshotEach(async () => {
      tx = await mockEvent.emitEvent();
    });

    it("Test events", async () => {
      await expectAllEvents(tx, [
        {
          contract: mockEvent,
          event: mockEvent.interface.events["Event()"],
          args: [],
        },
      ]);
    });

    it("Fails with wrong address", async () => {
      await expect(
        expectAllEvents(tx, [{ contract: mockEvents, event: mockEvents.interface.events["Event()"], args: [] }])
      ).to.be.rejectedWith("Log address mismatch");
    });

    it("Fails with extra arg", async () => {
      await expect(
        expectAllEvents(tx, [{ contract: mockEvent, event: mockEvent.interface.events["Event()"], args: [1] }])
      ).to.be.rejectedWith(`Expected "Event" event to have 1 argument(s), but it has 0`);
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

    it("Test events", async () => {
      await expectAllEvents(tx, [
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"],
          args,
        },
      ]);
    });

    it("Fails with incorrect arg", async () => {
      args[3] = 99;
      await expect(
        expectAllEvents(tx, [
          {
            contract: mockEvents,
            event: mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"],
            args,
          },
        ])
      ).to.be.rejectedWith("expected 42 to equal 99");
    });

    it("Fails with partial string arg", async () => {
      args[4] = "Hello";
      await expect(
        expectAllEvents(tx, [
          {
            contract: mockEvents,
            event: mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"],
            args,
          },
        ])
      ).to.be.rejectedWith("expected 'Hello World' to equal 'Hello'");
    });
  });

  describe("Many events, single contract", () => {
    const value = 42;
    const str = "Hello World";
    const data = "0x1234567890";
    let args: [string, string, string, BigNumberish, string, string];

    snapshotEach(async () => {
      args = [alice.address, bob.address, charlie.address, value, str, data];
      const calls = [
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitEmpty()).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitString(str)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitUint(1)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitMultiple(...args)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitUint(2)).data!,
        },
      ];
      tx = await multicall.call(calls);
    });

    it("Test events", async () => {
      await expectAllEvents(tx, [
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Empty()"],
          args: [],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["String(string)"],
          args: [str],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Uint(uint256)"],
          args: [1],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"],
          args,
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Uint(uint256)"],
          args: [2],
        },
      ]);
    });
  });

  describe("Many events, multiple contracts", () => {
    const value = 42;
    const str = "Hello World";
    const data = "0x1234567890";
    let args: [string, string, string, BigNumberish, string, string];

    snapshotEach(async () => {
      args = [alice.address, bob.address, charlie.address, value, str, data];
      const calls = [
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitEmpty()).data!,
        },
        {
          to: mockEvent.address,
          data: (await mockEvent.populateTransaction.emitEvent()).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitString(str)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitUint(1)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitMultiple(...args)).data!,
        },
        {
          to: mockEvents.address,
          data: (await mockEvents.populateTransaction.emitUint(2)).data!,
        },
        {
          to: mockEvent.address,
          data: (await mockEvent.populateTransaction.emitEvent()).data!,
        },
      ];
      tx = await multicall.call(calls);
    });

    it("Test events", async () => {
      await expectAllEvents(tx, [
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Empty()"],
          args: [],
        },
        {
          contract: mockEvent,
          event: mockEvent.interface.events["Event()"],
          args: [],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["String(string)"],
          args: [str],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Uint(uint256)"],
          args: [1],
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Multiple(address,address,address,uint256,string,bytes)"],
          args,
        },
        {
          contract: mockEvents,
          event: mockEvents.interface.events["Uint(uint256)"],
          args: [2],
        },
        {
          contract: mockEvent,
          event: mockEvent.interface.events["Event()"],
          args: [],
        },
      ]);
    });
  });
});
