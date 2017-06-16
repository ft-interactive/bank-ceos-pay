import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  const data = JSON.parse(document.getElementById('data').textContent);

  return (
    <p>Hi, I&apos;m React.</p>
  );
}

const reactApp = <App />;

ReactDOM.render(reactApp, document.getElementById('react-app'));
