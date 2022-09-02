import { ONE_DAY } from "../../src";

// This test catches an issue where `after is not defined` was thrown
async function main(): Promise<void> {
  console.log(ONE_DAY);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
