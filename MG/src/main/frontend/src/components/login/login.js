import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../api.js';
import SignIn from './signin.js';
import SignUp from './signup.js';

import gilLookUp from '../../assets/gil-corner-lookup.png';
import gilLookRight from '../../assets/gil-corner-lookright.png';
import gilLookFront from '../../assets/gil-corner-lookfront.png';
import gilLookDown from '../../assets/gil-corner-lookdown.png';

import '../../cssModules/login.css';

function LoginPage() {
  /* TRIGGER VARIABLES */
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn(!isSignIn);

  const [gilImage, setGilImage] = useState(gilLookUp);

  const navigate = useNavigate();

  /* API CALL */
  const handleAuth = async (formData) => {
    try {
      let res;
      if (isSignIn) { res = await api.post("/sessions", formData); }
      else { res = await api.post("/api/users", formData); }
      console.log("Success: ", res.status, res.statusText, "\n",res.data);

      navigate("/dashboard");
    } catch (err) {
      setGilImage(gilLookUp);

      if (err.response) {
        if (formData.name) {
          alert(`Oh damn, API is not working ${formData.name} : (`);
        } else {
          alert("Oh damn, API is not working : (");
        }
        console.log("Error response: ", err.response.status, err.response.statusText, "\n", err.response.data);
      } else {
        alert("Probably network error :/");
        console.log("Requested but no response: ", err.request);
      }
      console.log("Data requested: ", err.config.data);

      setTimeout(() => { setGilImage(gilLookFront); }, 100);
    }
  };

  return (
    <div className="login-bg container-fluid vh-100">
      <img
        src={gilImage}
        alt="gil"
        className="gil-login"
      />
      <div className="row h-100">
        {/* PROJECT NAME COLUMN */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="d-flex flex-row flex-md-column align-items-center">
            <img
              src="/MG-logo.png"
              alt="MG"
              className="project-logo"
            />
            <h1 className="text-white fw-bold ms-3 mt-2 ms-md-0 mt-md-4">MyGil</h1>
          </div>
        </div>

        {/* FORM COLUMN */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          {isSignIn ? (
            <SignIn
              onSubmit={handleAuth}
              onSwitch={toggleForm}
              gilRight={() => setGilImage(gilLookRight)}
              gilDown={() => setGilImage(gilLookDown)}
              gilFront={() => setGilImage(gilLookFront)}
            />
          ) : (
            <SignUp
              onSubmit={handleAuth}
              onSwitch={toggleForm}
              gilRight={() => setGilImage(gilLookRight)}
              gilDown={() => setGilImage(gilLookDown)}
              gilFront={() => setGilImage(gilLookFront)}
              gilUp={() => setGilImage(gilLookUp)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
