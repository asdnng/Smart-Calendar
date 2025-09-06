import logo from './logo.svg';
import './App.css';

import Header from './components/header.js';
import Body from './components/body.js';

function App() {

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <Header />
      <Body />
    </div>
  );
}

export default App;
