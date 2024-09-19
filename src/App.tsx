import React, {useState} from 'react';
import {sample} from "./sample";
import './App.css';
import {WorkerAction} from './worker-action';

type EditorProps = {program: string, setProgram: (program: string) => void};
const Editor = ({program, setProgram}: EditorProps) => {
  return <textarea name="editor" rows={40} cols={40} value={program} onChange={(x) => setProgram(x.target.value)}>
  </textarea>
};



type P = {
  program: string,
  onRender: (svg: string) => void;
  render: (render: (program: string) => void, data: string | undefined) => React.ReactElement;
};
type S = {worker: Worker, data: string | undefined};

class CFDGWorker extends React.Component<P, S> {
  dorender: (program: string) => void;
  constructor(props: P) {
    super(props);
    this.state = {worker: null as any as Worker, data: undefined};
    this.dorender = (program: string) => {
      const action: WorkerAction = {
        action: "render",
        program,
      };
      this.state.worker.postMessage(action);
    };

  }
  componentDidMount(): void {
    const worker: Worker = new Worker(new URL("./worker.ts", import.meta.url));
    worker.onmessage = (ev) => {
      const png = ev.data.output as Uint8Array;
      const blob = new Blob([png]);
      const url = URL.createObjectURL(blob);
      this.setState(s => ({...s, data: url}));
    };
    worker.onerror = (ev) => {
      console.error(ev)
    };
    this.setState({worker});
  }

  componentWillUnmount(): void {
    this.setState(s => {
      s.worker.terminate();
      return {};
    });
    console.log("UNMOUNT");
  }
  
  render(): React.ReactNode {
    return this.props.render(this.dorender, this.state.data);
  }
}

type RenderButtonProps = {onClick: () => void};
const RenderButton: React.FunctionComponent<RenderButtonProps> = ({onClick}) => 
  <div>
    <button onClick={onClick}>Render</button>
  </div>;

  const imgstyle = {
    width: "100%" as const,
    objectFit: "cover" as const,
  };

function App() {
  const [program, setProgram] = useState(sample);
  return (
    <div>
      <CFDGWorker program={program}
        onRender={() => {}}
        render={(render, data) => {
          return <div style={{display: "flex", flexDirection: "row"}}>
            <div>
              <Editor program={program} setProgram={setProgram}/>
              <RenderButton onClick={() => render(program)} />
            </div>
            {
              data
              ? <img src={data}
                  alt="x"
                  style={imgstyle}/>
              : "no image yet"
            }
            </div>;
          }
        }
      />
    </div>
  );
}

export default App;
