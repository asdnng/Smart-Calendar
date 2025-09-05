//import logo from './logo.svg';
//import './App.css';
//
//function App() {
//  return (
//    <div className="App">
//      <header className="App-header">
//        <img src={logo} className="App-logo" alt="logo" />
//        <p>
//          Edit <code>src/App.js</code> and save to reload.
//        </p>
//        <a
//          className="App-link"
//          href="https://reactjs.org"
//          target="_blank"
//          rel="noopener noreferrer"
//        >
//          Learn React
//        </a>
//      </header>
//    </div>
//  );
//}
//
//export default App;

import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [oauthUrl, setOauthUrl] = useState('');

    const fetchOAuthUrl = () => {
        const redirectUri = encodeURIComponent('http://localhost:8080/callback');
        axios.get(`/api/oauth/login/google?redirectUri=${redirectUri}`)
            .then(response => setOauthUrl(response.data))
            .catch(error => console.error('Error fetching OAuth URL:', error));
    };

    return (
        <div>
            <button onClick={fetchOAuthUrl}>Get Google OAuth URL</button>
            {oauthUrl && (
                <div>
                    <p>Generated OAuth URL:</p>
                    <a href={oauthUrl} target="_blank" rel="noopener noreferrer">{oauthUrl}</a>
                </div>
            )}
        </div>
    );
}

export default App;
