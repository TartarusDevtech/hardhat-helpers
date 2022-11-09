import { expect } from "chai";

import { calcShareRemainder } from "../../../src";

describe("math / calcShareRemainder", () => {
  it("5%", async () => {
    expect(calcShareRemainder(100, 500)).to.eq(95);
  });

  it("Rounds down", async () => {
    expect(calcShareRemainder(101, 500)).to.eq(96);
  });

  it("Rounds up", async () => {
    expect(calcShareRemainder(101, 500, true)).to.eq(95);
  });
});
