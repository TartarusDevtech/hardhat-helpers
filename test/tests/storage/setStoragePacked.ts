import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

import { getRandomAddress, getStoragePackedUint32, setStoragePackedUint32, snapshotEach } from "../../../src";
import { MockPackedStorage, MockPackedStorage__factory } from "../../typechain";

describe("storage / setStoragePacked", () => {
  let mock: MockPackedStorage;
  const previousAddr = getRandomAddress(1);
  const previousU32 = 42;
  const previousU64 = BigNumber.from(2).pow(64).sub(1);

  snapshotEach(async () => {
    const [deployer] = await ethers.getSigners();
    mock = await new MockPackedStorage__factory(deployer).deploy();
    await mock.set(previousAddr, previousU32, previousU64);
  });

  hasCorrectValues(previousU32);

  for (const newValue of [0, 1, BigNumber.from(2).pow(32).sub(1)]) {
    describe(`On change to ${BigNumber.from(newValue).toString()}`, () => {
      snapshotEach(async () => {
        await setStoragePackedUint32(mock, 0, 20, newValue);
      });

      hasCorrectValues(newValue);
    });
  }

  function hasCorrectValues(expectedU32: BigNumberish) {
    it("Has correct address", async () => {
      expect(await mock.addr()).to.eq(previousAddr);
    });

    it("Has correct u32", async () => {
      expect(await mock.u32()).to.eq(expectedU32);
    });

    it("Has correct u64", async () => {
      expect(await mock.u64()).to.eq(previousU64);
    });

    it("Can read u32 from storage", async () => {
      const value = await getStoragePackedUint32(mock, 0, 20);
      expect(value).to.eq(expectedU32);
    });
  }
});
