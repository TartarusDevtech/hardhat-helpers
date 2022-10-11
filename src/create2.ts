import { ethers } from "hardhat";

export function compute1167Create2Address(
  factory: { address: string },
  implementation: { address: string },
  salt: string
): string {
  const creationCode = [
    "0x3d602d80600a3d3981f3363d3d373d3d3d363d73",
    implementation.address.replace(/0x/, "").toLowerCase(),
    "5af43d82803e903d91602b57fd5bf3",
  ].join("");
  const initCodeHash = ethers.utils.keccak256(creationCode);
  return ethers.utils.getCreate2Address(factory.address, salt, initCodeHash);
}
