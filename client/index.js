import React from 'react';
import ReactDOM from 'react-dom';
import GTable from './components/g-table/index.jsx';

const App1 = () => {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <GTable
      data={data}
      compensation
      shares={false}
    />
  );
};
const App2 = () => {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <GTable
      data={data}
      compensation={false}
      shares
    />
  );
};
const App3 = () => {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <GTable
      data={data}
      compensation
      shares
    />
  );
};
const reactApp1 = <App1 />;
const reactApp2 = <App2 />;
const reactApp3 = <App3 />;

ReactDOM.render(reactApp1, document.getElementById('react-app1'));

ReactDOM.render(reactApp2, document.getElementById('react-app2'));

ReactDOM.render(reactApp3, document.getElementById('react-app3'));
