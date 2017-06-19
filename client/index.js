import React from 'react';
import ReactDOM from 'react-dom';
import GTable from './components/g-table/index.jsx';

function App() {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <div className="o-grid-row">
      <div data-o-grid-colspan="12 S11 Scenter">
        <GTable data={data} />
      </div>
    </div>

  );
}

const reactApp = <App />;

ReactDOM.render(reactApp, document.getElementById('react-app'));
