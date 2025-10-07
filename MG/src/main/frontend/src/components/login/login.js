import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '../../axiosSetup.js';
import SignIn from './signin.js';
import SignUp from './signup.js';

import gilLookUp from '../../assets/gil-corner-lookup.png';
import gilLookRight from '../../assets/gil-corner-lookright.png';
import gilLookFront from '../../assets/gil-corner-lookfront.png';
import gilLookDown from '../../assets/gil-corner-lookdown.png';

import '../../cssModules/login.css';

function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [gilImage, setGilImage] = useState(gilLookUp);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGil = (look) => {
    if (look === "right") { setGilImage(gilLookRight); }
    else if (look === "down") { setGilImage(gilLookDown); }
    else if (look === "front") { setGilImage(gilLookFront); }
    else { setGilImage(gilLookUp); }
  };

  const authSuccess = useCallback((token, method) => {
    localStorage.setItem("token", token);  // store JWT from backend
    console.log(`${method} token stored: `, token);
    navigate("/dashboard", { replace: true });

//    if (location.search.includes("token=")) {
//      window.history.replaceState({}, document.title, "/dashboard");
//    }
  }, [navigate]);

  /* SIGNIN/SIGNUP AUTHORIZATION */
  // token from API// please be aware when write the endpoint. we don't have /sessions and /users api.
  const handleSubmitForm = async (formData) => {
    try {
      const res = isSignIn
        ? await api.post("/login", formData) // sign in
        : await api.post("/user", formData);  // sign up
      console.log("Success: ", res.status, res.statusText, "\n", res.data);
      authSuccess(res.data.accessToken, res.data.refreshToken, "Web");
    } catch (err) {
      handleGil("up");

      if (err.response) {
        alert(`Oh damn, server error ${formData.name ? formData.name : ""} :O`);
        console.log("Error response: ", err.response.status, err.response.statusText, "\n", err.response.data);
      } else if (err.request) {
        alert("Probably network error :/");
        console.log("Requested but no response: ", err.request);
      } else {
        alert("Something went wrong :(")
        console.log("Unknown error: ", err.message);
      }
      console.log("Data requested: ", err.config.data);

      setTimeout(() => handleGil("front"), 100);
    }
  };

  /* GOOGLE AUTHORIZATION */
  // token from URL
  const handleGoogleLogin = () => {
    // redirect to backend endpoint -> Google OAuth
    window.location.href = "http://localhost:8080/auth/google"; // need modify
//    window.open("https://accounts.google.com/o/oauth2/v2/auth", "blank", "noopener,noreferrer")
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) { authSuccess(token, "Google"); }
  }, [location.search, authSuccess]);

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
              onSwitch={() => setIsSignIn(!isSignIn)}
              onSubmit={handleSubmitForm}
              onGoogle={handleGoogleLogin}
              setGil={handleGil}
            />
          ) : (
            <SignUp
              onSwitch={() => setIsSignIn(!isSignIn)}
              onSubmit={handleSubmitForm}
              onGoogle={handleGoogleLogin}
              setGil={handleGil}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
