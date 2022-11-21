import { expect } from "chai";
import { readFileSync } from "fs";

import { generateErrorTestHelpers } from "../../../../src/scripts";
import { ContractErrors } from "./expectedOutput/ByName";

describe("scripts / generateCustomErrors / generateTestHelpers", () => {
  it("Generates helpers", async () => {
    const results = generateErrorTestHelpers("./ByName", ContractErrors);
    const expected = readFileSync(`${__dirname}/expectedOutput/testHelpers.ts`, "utf8");
    expect(results).to.eq(expected);
  });
});
