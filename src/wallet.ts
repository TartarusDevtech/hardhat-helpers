import { ethers } from "hardhat";

/**
 * Returns a pseudo-random address based on the index provided.
 */
export function getRandomAddress(index: number) {
  return getRandomSigner(index).address;
}

/**
 * Returns a pseudo-random account based on the index provided.
 */
export function getRandomSigner(index: number) {
  let wallet = ethers.Wallet.fromMnemonic(
    "test test test test test test test test test test test junk",
    `m/44'/60'/0'/1/${index}`
  );
  wallet = wallet.connect(ethers.provider);
  return wallet;
}
