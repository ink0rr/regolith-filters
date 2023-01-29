import { checkBP } from "./src/checkBP.ts";
import { checkRP } from "./src/checkRP.ts";

await Promise.all([
  checkBP(),
  checkRP(),
]);
