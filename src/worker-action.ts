
export type RenderAction = {
  action: "render",
  program: string,
};

export type WorkerAction = RenderAction;

export type WorkerActionOutcome =
  {success: true, data: Uint8Array}
| {success: false, error: unknown, stderr_output: string};


