import "hardhat-tracer";

import { tracer } from "hardhat";

import { AddressLike, toAddress } from "./types";

export async function registerTracerNames<T extends { [key: string]: AddressLike }>(accounts: T, prefix?: string) {
  // Add name aliases to tracer (e.g. when using --logs)
  let accountName: keyof typeof accounts;
  for (accountName in accounts) {
    const signer = accounts[accountName];
    let name: string = accountName;
    if (prefix) {
      name = prefix + name;
    }
    tracer.nameTags[toAddress(signer)] = name;
  }
}
