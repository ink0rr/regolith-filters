import { checkBP } from "./src/checkBP.ts";
import { checkRP } from "./src/checkRP.ts";

const label = "Completed in";
console.time(label);

await Promise.all([
  checkBP(),
  checkRP(),
]);

console.timeEnd(label);
