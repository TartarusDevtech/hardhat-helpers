import { expect } from "chai";
import { readFileSync } from "fs";

import { generateCustomErrorsFile } from "../../../../src/scripts";
import { CustomErrors__factory, CustomErrors2__factory, CustomErrorsWithConflict__factory } from "../../../typechain";

describe("scripts / generateCustomErrors / generateErrors", () => {
  describe("Happy case", () => {
    const contracts = [CustomErrors__factory, CustomErrors2__factory];

    it("By signature", async () => {
      const results = generateCustomErrorsFile(contracts, { keyBy: "errorCode" });
      const expected = readFileSync(`${__dirname}/expectedOutput/BySignature.ts`, "utf8");
      expect(results).to.eq(expected);
    });

    it("By name", async () => {
      const results = generateCustomErrorsFile(contracts, { keyBy: "errorName" });
      const expected = readFileSync(`${__dirname}/expectedOutput/ByName.ts`, "utf8");
      expect(results).to.eq(expected);
    });
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
