import { expect } from "chai";
import { BigNumberish, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { ContractErrors, CustomContractError } from "./ByName";

async function expectCustomError(tx: Promise<ContractTransaction>, error: CustomContractError, ...args: any[]) {
  const factory = await ethers.getContractFactory(error.contractName);
  await expect(tx)
    .to.be.revertedWithCustomError(factory, error.name)
    .withArgs(...args);
}

export const expectError = {
  CustomErrors_Test_1: async function (
    tx: Promise<ContractTransaction>,
  ) {
    await expectCustomError(
      tx,
      ContractErrors.CustomErrors_Test_1,
    );
  },
  CustomErrors_Test_2: async function (
    tx: Promise<ContractTransaction>,
    a: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrors.CustomErrors_Test_2,
      a,
    );
  },
  CustomErrors_Test_3: async function (
    tx: Promise<ContractTransaction>,
    a: BigNumberish,
    b: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrors.CustomErrors_Test_3,
      a,
      b,
    );
  },
  CustomErrors_Test_4: async function (
    tx: Promise<ContractTransaction>,
    a: BigNumberish,
    b: BigNumberish,
    c: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrors.CustomErrors_Test_4,
      a,
      b,
      c,
    );
  },
};
