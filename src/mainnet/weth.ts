import { ethers } from "hardhat";

import { Weth__factory } from "../typechain";

const contractAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const weth = Weth__factory.connect(contractAddress, ethers.provider);
