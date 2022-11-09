import { expect } from "chai";

import { calcShare } from "../../../src";

describe("math / calcShare", () => {
  it("5%", async () => {
    expect(calcShare(100, 500)).to.eq(5);
  });

  it("Rounds down", async () => {
    expect(calcShare(101, 500)).to.eq(5);
  });

  it("Rounds up", async () => {
    expect(calcShare(101, 500, true)).to.eq(6);
  });
});
