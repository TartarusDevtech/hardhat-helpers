import { expect } from "chai";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { Addressish } from "hardhat-helpers";

import { ContractErrorsByName, CustomContractError } from "./customErrors";

async function expectCustomError(tx: Promise<any>, error: CustomContractError, ...args: any[]) {
  try {
    const factory = await ethers.getContractFactory(error.contractName);
    await expect(tx)
      .to.be.revertedWithCustomError(factory, error.name)
      .withArgs(...args);
  } catch (e: any) {
    // This is a workaround to support Viem transactions
    // Pending https://github.com/NomicFoundation/hardhat/issues/4874

    // TODO: how to account for args?
    if (!e.message?.includes(`reverted with custom error '${error.name}(${args.join(", ")})'`))
      throw e;
  }
}

export const expectError = {
  CustomErrors_Test_1: async function (
    tx: Promise<any>,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_1,
    );
  },
  CustomErrors_Test_2: async function (
    tx: Promise<any>,
    a: BigNumberish,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_2,
      a,
    );
  },
  CustomErrors_Test_3: async function (
    tx: Promise<any>,
    a: BigNumberish,
    b: Addressish,
  ) {
    await expectCustomError(
      tx,
      ContractErrorsByName.CustomErrors_Test_3,
      a,
      b,
    );
  },
  CustomErrors_Test_4: async function (
    tx: Promise<any>,
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
