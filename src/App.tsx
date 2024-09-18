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
  render: (render: (program: string) => void, svg: string | undefined) => React.ReactElement;
};
type S = {worker: Worker, svg: string | undefined};

class CFDGWorker extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    this.state = {worker: null as any as Worker, svg: undefined};
  }
  componentDidMount(): void {
    const worker: Worker = new Worker(new URL("./worker.ts", import.meta.url));
    worker.onmessage = (ev) => {
      const svg = ev.data.output as string;
      this.setState(s => ({...s, svg}));
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
    const render = (program: string) => {
      const action: WorkerAction = {
        action: "render",
        program,
      };
      this.state.worker.postMessage(action);
    };
    return this.props.render(render, this.state.svg);
  }
}

type RenderButtonProps = {onClick: () => void};
const RenderButton: React.FunctionComponent<RenderButtonProps> = ({onClick}) => 
  <div>
    <button onClick={onClick}>Render</button>
  </div>;

function App() {
  const [program, setProgram] = useState(sample);
  return (
    <div>
      <CFDGWorker program={program}
        onRender={() => {}}
        render={(render, svg) => {
          return <div style={{display: "flex", flexDirection: "row"}}>
            <div>
              <Editor program={program} setProgram={setProgram}/>
              <RenderButton onClick={() => render(program)} />
            </div>
            {
              svg 
              ? <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
                  alt="x"
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}/>
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
