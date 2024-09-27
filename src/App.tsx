import React, {useState} from 'react';
import {sample} from "./sample";
import './App.css';
import {WorkerAction, WorkerActionOutcome} from './worker-action';


type EditorProps = {program: string, setProgram: (program: string) => void};
const Editor = ({program, setProgram}: EditorProps) => {
  return <textarea name="editor"
    style={{
      width: "100%",
      height: "100%",
      background: "transparent",
      textShadow: "grey 0px 0px 9px",
      color: "black",
      resize: "none",
      border: "none",
      fontFamily: "Inconsolata",
      boxSizing: "border-box",
    }}
    value={program}
    spellCheck={false}
    onChange={(x) => setProgram(x.target.value)}>
  </textarea>
};



class WorkerPool {
  private poolSize: number;
  private initializing: Worker[] = [];
  private ready: Worker[] = [];
  private active: Worker | null = null;
  private terminating = false;
  private messages: WorkerAction[] = [];

  public onmessage: ((message: WorkerActionOutcome) => void) | undefined = undefined;

  constructor(poolSize: number) {
    this.poolSize = poolSize;
    this.populate();
  }

  private populate() {
    const count = this.initializing.length + this.ready.length;
    if (this.terminating || count >= this.poolSize || this.active) return;
    const worker: Worker = new Worker(new URL("./worker", import.meta.url), {type: "module"});
    this.initializing.push(worker);
    worker.onmessage = (ev) => {
      worker.onmessage = null;
      if (ev.data !== "ready") {
        throw new Error(`unexpected message: ${ev.data}`);
      }
      const idx = this.initializing.indexOf(worker);
      if (idx < 0) throw new Error("worker missing");
      this.initializing.splice(idx, 1);
      this.ready.push(worker);
      this.work();
    }
    worker.onerror = () => {
      throw new Error("not yet");
    }
  }

  private work() {
    if (this.messages.length === 0) {
      this.populate();
      return;
    }
    if (this.active) return;
    const worker = this.ready.pop();
    if (!worker) {
      this.populate();
      return;
    }
    const message = this.messages.shift();
    this.active = worker;
    worker.onmessage = (ev) => {
      this.active = null;
      this.work();
      worker.terminate();
      this.onmessage?.(ev.data);
    }
    worker.onerror = () => {
      throw new Error("not yet");
    }
    worker.postMessage(message);
  }

  public terminateAll() {
    this.terminating = true;
    const clear = (ls: Worker[]) => {
      while(true) {
        const worker = ls.pop();
        if (!worker) return;
        worker.terminate();
      }
    };
    clear(this.initializing);
    clear(this.ready);
    if (this.active) {
      this.active.terminate();
      this.active = null;
    }
  }

  public postMessage(message: WorkerAction) {
    this.messages.push(message);
    this.work();
  }

}

type P = {
  program: string,
  onRender: (svg: string) => void;
  render: (render: (program: string) => void, data: string | undefined, error: string | undefined) => React.ReactElement;
};

type S = {
  pool: WorkerPool,
  data: string | undefined,
  error: string | undefined,
};


class CFDGWorker extends React.Component<P, S> {
  dorender: (program: string) => void;
  constructor(props: P) {
    super(props);
    this.dorender = (program: string) => {
      const action: WorkerAction = {
        action: "render",
        program,
        width: window.document.body.clientWidth,
        height: window.document.body.clientHeight,
      };
      this.state.pool.postMessage(action);
    };
  }
  componentDidMount(): void {
    const pool = new WorkerPool(3);
    pool.onmessage = (outcome) => {
      if (outcome.success) {
        const blob = new Blob([outcome.data]);
        const url = URL.createObjectURL(blob);
        this.setState(s => ({...s, data: url, error: undefined}));
      } else {
        this.setState(s => ({...s, data: undefined, error: outcome.stderr_output}));
      }
    };
    //pool.onerror = (ev) => {
    //  console.error(ev)
    //};
    this.setState({pool});
  }

  componentWillUnmount(): void {
    this.setState(s => {
      s.pool.terminateAll();
      return {};
    });
  }

  render(): React.ReactNode {
    return this.props.render(this.dorender, this.state?.data, this.state?.error);
  }
}

type RenderButtonProps = {onClick: () => void};
const RenderButton: React.FunctionComponent<RenderButtonProps> = ({onClick}) =>
  <>
    <button onClick={onClick}>Render</button>
  </>;

const imgstyle: React.CSSProperties = {
  position: "absolute",
  width: "100vw",
  height: "100vh",
  objectFit: "contain",
  top: 0,
  right: 0,
  zIndex: -1,
};

function App() {
  const [program, setProgram] = useState(sample);
  return (
      <CFDGWorker program={program}
        onRender={() => {}}
        render={(render, data, error) => {
          return <>
            <Editor program={program} setProgram={setProgram}/>
            <div style={{position: "absolute", top: 0, right: 0}}>
              <RenderButton onClick={() => render(program)} />
              <div style={{color: "red"}}>{error || null}</div>
            </div>
            { data ? <img src={data} alt="x" style={imgstyle}/> : null }
          </>;
          }
        }
      />
  );
}

export default App;
