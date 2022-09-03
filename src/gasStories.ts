import { BigNumber, ContractTransaction, providers } from "ethers";
import { ethers } from "hardhat";
const provider: providers.JsonRpcProvider = ethers.provider;
import chalk from "chalk";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
/*
 CircleCI supported chalk styles
  - blue
  - blueBright
  - cyan
  - green
  - greenBright
  - magenta
  - red
  - redBright
  - yellow
  - yellowBright
*/

const ETH_PRICE = Number.parseFloat(process.env.ETH_PRICE ?? "2000");
const GAS_PRICE = Number.parseFloat(process.env.GAS_PRICE ?? "100");
const resultsFile = process.env.GAS_STORIES_FILE;

type GasRecord = {
  [description: string]: GasRecord | BigNumber;
};

const records: GasRecord = {};
let resultsLog = "";

export async function gasStory(
  tx: ContractTransaction | ContractTransaction[],
  ...categories: string[]
): Promise<void> {
  let gasUsed = BigNumber.from(0);
  if (Array.isArray(tx)) {
    for (const t of tx) {
      const receipt = await provider.getTransactionReceipt(t.hash);
      gasUsed = gasUsed.add(receipt.gasUsed);
    }
  } else {
    const receipt = await provider.getTransactionReceipt(tx.hash);
    gasUsed = receipt.gasUsed;
  }

  let record = records;
  for (const category of categories.slice(0, categories.length - 1)) {
    const entry = record[category];
    if (!entry) {
      record = record[category] = {};
    } else if (BigNumber.isBigNumber(entry)) {
      throw new Error(`Entry for ${category} has already been populated.`);
    } else {
      record = entry;
    }
  }
  if (record[categories[categories.length - 1]]) {
    throw new Error(`Entry for ${categories[categories.length - 1]} has already been populated.`);
  }
  record[categories[categories.length - 1]] = gasUsed;
}

after(async () => {
  if (Object.entries(records).length === 0) {
    // No results recorded
    return;
  }
  const intro = `User story gas usage -- ETH $${ETH_PRICE.toLocaleString()}; ${GAS_PRICE.toLocaleString()} gwei gasPrice`;
  console.log(intro);
  console.log("=".repeat(intro.length));

  printRecords(records, 0);

  if (resultsFile) {
    mkdirSync(path.dirname(resultsFile), { recursive: true });
    writeFileSync(resultsFile, resultsLog);
  }
});

function printRecords(records: GasRecord, depth: number, printValues = true) {
  let minGas: BigNumber | undefined;
  let maxGas: BigNumber | undefined;

  for (const key of Object.keys(records).sort((a, b) => a.localeCompare(b))) {
    const record = records[key];
    if (BigNumber.isBigNumber(record)) {
      if (!printValues) continue;
      if (!minGas || minGas.gt(record)) {
        minGas = record;
      }
      if (!maxGas || maxGas.lt(record)) {
        maxGas = record;
      }
      const tab = "".padStart(4 * (depth - 1));

      console.log(`${tab}${getPrintedCost(record, {})} - ${key}`);
      resultsLog += `${tab}${getPrintedCost(record, { shouldChalk: false, includeDollarEst: false })} - ${key}\n`;
    } else {
      if (printValues) continue;
      if (depth === 0) {
        const header = "\n" + "·".repeat(key.length + 4) + `\n· ${key} ·\n` + "·".repeat(key.length + 4);
        console.log(header);
        resultsLog += `${header}\n`;
      } else {
        const tab = "".padStart(4 * depth);
        console.log(`\n${tab}${chalk.underline(key)}`);
        resultsLog += `\n${tab}${key}\n`;
      }
      printRecords(record, depth + 1);
    }
  }

  if (printValues) {
    const range = getPrintedCostRange(minGas, maxGas);
    if (range) {
      const tab = "".padStart(4 * (depth - 1));
      console.log(`${tab}${range}`);
    }
    printRecords(records, depth, false);
  }
}

function calcGasCost(gasUsed: BigNumber) {
  return (
    ETH_PRICE *
    Number.parseFloat(ethers.utils.formatEther(gasUsed.mul(ethers.utils.parseUnits(GAS_PRICE.toString(), "gwei"))))
  );
}

function getPrintedCost(
  gasUsed: BigNumber,
  {
    shouldChalk = true,
    shouldPad = true,
    includeDollarEst = true,
  }: { shouldChalk?: boolean; shouldPad?: boolean; includeDollarEst?: boolean }
): string {
  let costString = "";
  if (includeDollarEst) {
    const cost = calcGasCost(gasUsed);
    costString = `$${cost.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} `.padStart(shouldPad ? 8 : 0);
    if (shouldChalk) {
      costString = `${chalk.greenBright(costString)}`;
    }
  }
  let gasString = gasUsed.toNumber().toLocaleString();
  if (shouldChalk) {
    gasString = `${chalk.yellow(gasString)}`;
  }
  if (includeDollarEst) {
    gasString = `(${gasString})`;
  }
  gasString = gasString.padStart(shouldPad ? (includeDollarEst ? 19 : 7) : 0);
  return `${costString}${gasString}`;
}

function getPrintedCostRange(minGasUsed: BigNumber | undefined, maxGasUsed: BigNumber | undefined): string | undefined {
  if (minGasUsed && maxGasUsed && !minGasUsed.eq(maxGasUsed)) {
    const min = getPrintedCost(minGasUsed, { shouldChalk: false, shouldPad: false });
    const max = getPrintedCost(maxGasUsed, { shouldChalk: false, shouldPad: false });
    return chalk.cyan(`Range: ${min} - ${max}`);
  }
}
