import { expect } from "chai";
import { readFileSync } from "fs";

import { generateCustomErrorsFile } from "../../../../src/scripts";
import { CustomErrors__factory, CustomErrors2__factory, CustomErrorsWithConflict__factory } from "../../../typechain";

describe("scripts / generateCustomErrors / generateErrors", () => {
  it("Generate errors file", async () => {
    const contracts = [CustomErrors__factory, CustomErrors2__factory];
    const results = generateCustomErrorsFile(contracts);
    const expected = readFileSync(`${__dirname}/expectedOutput/customErrors.ts`, "utf8");
    expect(results).to.eq(expected);
  });

  describe("Conflict", () => {
    it("Throws", async () => {
      const contracts = [CustomErrors__factory, CustomErrorsWithConflict__factory];
      expect(() => generateCustomErrorsFile(contracts, { keyBy: "errorName" })).to.throw(
        "Duplicate error name: CustomErrors_Test_3"
      );
    });
  });
});
