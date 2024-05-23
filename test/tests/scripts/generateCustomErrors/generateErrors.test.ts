import { expect } from "chai";
import { readFileSync } from "fs";

import { generateCustomErrorsFile } from "../../../../src/scripts";
import { CustomErrors__factory, CustomErrors2__factory, CustomErrorsWithConflict__factory } from "../../../typechain";

describe("scripts / generateCustomErrors / generateErrors", () => {
  const contracts = [CustomErrors__factory, CustomErrors2__factory];

  it("Generate errors file", async () => {
    const results = generateCustomErrorsFile(contracts);
    const expected = readFileSync(`${__dirname}/expectedOutput/customErrors.ts`, "utf8");
    expect(results).to.eq(expected);
  });

  it("Generate errors file with placeholder", async () => {
    const results = generateCustomErrorsFile(contracts, { reasonRequirement: "Warn", descriptionRequirement: "Warn"});
    const expected = readFileSync(`${__dirname}/expectedOutput/customErrorsWarn.ts`, "utf8");
    expect(results).to.eq(expected);
  });

  it("Generate errors fails with missing requirement", async () => {
    expect(() => generateCustomErrorsFile(contracts, { reasonRequirement: "Error", descriptionRequirement: "Error"})).to.be.throw("Reason is required for error: CustomErrors_Test_2");    
  });

  describe("Conflict", () => {
    it("Throws", async () => {
      const contracts = [CustomErrors__factory, CustomErrorsWithConflict__factory];
      expect(() => generateCustomErrorsFile(contracts)).to.throw("Duplicate error name: CustomErrors_Test_3");
    });
  });
});
