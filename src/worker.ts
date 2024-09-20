/// <reference types="emscripten" />

import * as CFDG from "cfdg/cfdg.js";
import {RenderAction, WorkerAction, WorkerActionOutcome} from "./worker-action";
/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;


type CFDGT = {
  onRuntimeInitialized: EmscriptenModule["onRuntimeInitialized"],
  callMain: (argv: string[]) => number,
  FS: {getStreamChecked: (fd: number) => any} & typeof globalThis.FS,
};

const cfdg: CFDGT = CFDG as any;

const queue: WorkerAction[] = [];
let ready = false;
cfdg.onRuntimeInitialized = () => {
  ready = true;
  postMessage("ready");
  performActions();
};

var counter = 0;

function doRender(action: RenderAction): WorkerActionOutcome {
  counter += 1;

  const filename = counter;
  cfdg.FS.writeFile(`/${filename}.cfdg`, action.program);
  const args = ["-q", "-w", "1000", "-h", "600", `/${filename}.cfdg`, `/${filename}.png`];

  const stderrFilename = '/stderr.txt';
  const old_stderr = cfdg.FS.getStreamChecked(2);
  cfdg.FS.close(old_stderr);
  const new_stderr = cfdg.FS.open(stderrFilename, 'w');
  if (new_stderr.fd !== 2) {
    throw new Error("file did not open as stderr");
  }

  try {
    const retval = cfdg.callMain(args);
    if (retval !== 0) {
      throw new Error(`main returned ${retval}`);
    }
  } catch (e) {
    cfdg.FS.close(new_stderr);
    // BUG: stderr is now closed, reentering will not work
    const stderr_output = cfdg.FS.readFile(stderrFilename, {encoding: "utf8"});
    return {success: false, error: e, stderr_output};
  } finally {
    cfdg.FS.unlink(`/${filename}.cfdg`);
  }
  const data = cfdg.FS.readFile(`/${filename}.png`)
  cfdg.FS.unlink(`/${filename}.png`);
  return {success: true, data: data};
}

function performAction(action: WorkerAction) {
  switch (action.action) {
    case "render": {
      const outcome = doRender(action);
      postMessage(outcome);
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

