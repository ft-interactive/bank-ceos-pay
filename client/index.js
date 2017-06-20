import React from 'react';
import ReactDOM from 'react-dom';
import GTable from './components/g-table/index.jsx';

function App() {
  const data = JSON.parse(document.getElementById('data').textContent);

  data.sort((a, b) => b.y2016.total - a.y2016.total);

  return (
    <GTable data={data} />
  );
}

const reactApp = <App />;

ReactDOM.render(reactApp, document.getElementById('react-app'));
