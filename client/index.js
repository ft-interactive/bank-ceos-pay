import React from 'react';
import ReactDOM from 'react-dom';
import GTable from './components/g-table/index.jsx';

const App = () => {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <GTable data={data} />
  );
};

const reactApp = <App />;

ReactDOM.render(reactApp, document.getElementById('react-app'));
