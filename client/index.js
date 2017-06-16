import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <p>Hi, I&apos;m React.</p>
  );
}

const reactApp = <App />;

ReactDOM.render(reactApp, document.getElementById('react-app'));
