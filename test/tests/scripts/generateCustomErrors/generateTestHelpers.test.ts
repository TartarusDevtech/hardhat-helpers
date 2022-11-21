import { expect } from "chai";
import { readFileSync } from "fs";

import { generateErrorTestHelpers } from "../../../../src/scripts";
import { ContractErrorsByName } from "./expectedOutput/customErrors";

describe("scripts / generateCustomErrors / generateTestHelpers", () => {
  it("Generates helpers", async () => {
    const results = generateErrorTestHelpers("./customErrors", ContractErrorsByName);
    const expected = readFileSync(`${__dirname}/expectedOutput/testHelpers.ts`, "utf8");
    expect(results).to.eq(expected);
  });
});
