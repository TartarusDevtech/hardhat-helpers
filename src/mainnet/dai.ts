import { BigNumberish } from "ethers";
import { ethers } from "hardhat";

import { setETHBalance } from "../balance";
import { impersonate } from "../fork";
import { Dai__factory } from "../typechain";

const contractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
// Wards have permission to mint
const wardAddress = "0x9759A6Ac90977b93B58547b4A71c78317f391A28";

export const dai = Dai__factory.connect(contractAddress, ethers.provider);

export async function mintDai(account: { address: string }, amount: BigNumberish = ethers.utils.parseEther("1000")) {
  const ward = await impersonate(wardAddress);
  await setETHBalance(ward);
  await dai.connect(ward).mint(account.address, amount);
}
