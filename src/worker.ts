

import * as CFDG from "cfdg/cfdg.js";
/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;
const cfdg: any = CFDG;
console.log("Worker Start!");
console.log(cfdg);

cfdg.onRuntimeInitialized = () => {
  console.log(cfdg);
  // console.log(cfdg.FS);
  // console.log(process.cwd());
  // console.log(cfdg.FS.cwd());
  // console.log(cfdg.FS.readdir(cfdg.FS.cwd()));
  cfdg.callMain([]);
};

ctx.onmessage = (event: MessageEvent<number>) => {
  console.log(event.data);
  const result = event.data * 2; // Example operation
  postMessage(result);      // Send the result back to the main thread
};

//export {};
