import { expect } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { TransactionHashish } from "hardhat-helpers";

import { ContractErrorsByName, CustomContractError } from "./customErrors";

async function expectCustomError(tx: Promise<TransactionHashish>, error: CustomContractError, ...args: any[]) {
  const factory = await ethers.getContractFactory(error.contractName);
  await expect(tx)
    .to.be.revertedWithCustomError(factory, error.name)
    .withArgs(...args);
}

export const expectError = {
  CustomErrors_Test_1: async function (
    tx: Promise<TransactionHashish>,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_1,
    );
  },
  CustomErrors_Test_2: async function (
    tx: Promise<TransactionHashish>,
    a: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_2,
      a,
    );
  },
  CustomErrors_Test_3: async function (
    tx: Promise<TransactionHashish>,
    a: BigNumberish,
    b: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_3,
      a,
      b,
    );
  },
  CustomErrors_Test_4: async function (
    tx: Promise<TransactionHashish>,
    a: BigNumberish,
    b: BigNumberish,
    c: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_4,
      a,
      b,
      c,
    );
  },
};
