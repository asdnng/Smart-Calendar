import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
    const [oauthUrl, setOauthUrl] = useState('');

    const fetchOAuthUrl = () => {
        const redirect = `${window.location.origin}/callback`;
        const redirectUri = encodeURIComponent(redirect);
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
