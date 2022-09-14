import { appendFileSync, writeFileSync } from "fs";

const stdin = process.stdin;
let data = "";

stdin.setEncoding("utf8");

stdin.on("data", function (chunk) {
  data += chunk;
});

stdin.on("end", function () {
  const json = JSON.parse(data)[0];
  const filename = `${__dirname}/../generated/manifest.txt`;
  writeFileSync(filename, "");
  for (const file of json.files) {
    appendFileSync(filename, `${file.path}\n`);
  }
});

stdin.on("error", console.error);
