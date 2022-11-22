import { ethers } from "hardhat";

import { AddressLike, toAddress } from "./types";

export function compute1167Create2Address(factory: AddressLike, implementation: AddressLike, salt: string): string {
  const creationCode = [
    "0x3d602d80600a3d3981f3363d3d373d3d3d363d73",
    toAddress(implementation).replace(/0x/, "").toLowerCase(),
    "5af43d82803e903d91602b57fd5bf3",
  ].join("");
  const initCodeHash = ethers.utils.keccak256(creationCode);
  return ethers.utils.getCreate2Address(toAddress(factory), salt, initCodeHash);
}
