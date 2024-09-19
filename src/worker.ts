/// <reference types="emscripten" />

import * as CFDG from "cfdg/cfdg.js";
import {RenderAction, WorkerAction} from "./worker-action";
/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;


type CFDGT = {
  onRuntimeInitialized: EmscriptenModule["onRuntimeInitialized"],
  callMain: (argv: string[]) => number,
  FS: typeof globalThis.FS,
};

const cfdg: CFDGT = CFDG as any;
console.log("Worker Start!");
console.log(cfdg);

const queue: WorkerAction[] = [];
let ready = false;
cfdg.onRuntimeInitialized = () => {
  console.log(cfdg);
  // console.log(cfdg.FS);
  // console.log(process.cwd());
  // console.log(cfdg.FS.cwd());
  // console.log(cfdg.FS.readdir(cfdg.FS.cwd()));
  ready = true;
  performActions();
  //cfdg.callMain([]);
};

function doRender(action: RenderAction): Uint8Array {

  cfdg.FS.writeFile("/input.cdfg", action.program);
  cfdg.callMain(["-w", "1000", "-h", "600", "/input.cdfg", "/output.png"]);
  const data = cfdg.FS.readFile("/output.png")
  cfdg.FS.unlink("/input.cdfg");
  cfdg.FS.unlink("/output.png");
  return data;
}

function performAction(action: WorkerAction) {
  switch (action.action) {
    case "render": {
      const output = doRender(action);
      postMessage({output});
      break;
    }
    default: 
      throw new Error("invalid action");
  }
}

function performActions() {
  if (!ready) return;
  while (true) {
    const action = queue.shift();
    if (action === undefined) return;
    performAction(action);
  }
}


ctx.onmessage = (event: MessageEvent<WorkerAction>) => {
  const action = event.data;
  queue.push(action);
  performActions();
};

//export {};
