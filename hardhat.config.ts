import "@nomicfoundation/hardhat-toolbox";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  paths: {
    tests: "./test/tests",
    artifacts: "./generated/artifacts/hardhat",
    cache: "./generated/cache",
    sources: "./test/contracts",
  },
  solidity: "0.8.16",
  typechain: {
    outDir: "./test/typechain",
  },
};

export default config;
