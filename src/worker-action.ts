
export type RenderAction = {
  action: "render",
  program: string,
  width: number,
  height: number,
};

export type WorkerAction = RenderAction;

export type WorkerActionOutcome =
  {success: true, data: Uint8Array}
| {success: false, error: unknown, stderr_output: string};


