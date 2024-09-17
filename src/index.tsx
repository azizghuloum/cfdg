import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const worker: Worker = new Worker(new URL("./worker.ts", import.meta.url));

worker.onmessage = (ev) => {
  console.log(ev);
};

worker.onerror = (ev) => {
  console.error(ev)
};

console.log(worker);

worker.postMessage("MY MSG");

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
