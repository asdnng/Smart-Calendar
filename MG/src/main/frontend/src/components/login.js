import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import googleLogo from '../assets/google-logo.png';
import gilLookUp from '../assets/gil-corner-lookup.png';
import gilLookRight from '../assets/gil-corner-lookright.png';
import gilLookFront from '../assets/gil-corner-lookfront.png';
import gilLookDown from '../assets/gil-corner-lookdown.png';

import '../cssModules/login.css';

//const BACKEND_API_BASE_URL = import.meta.env.REACT_BACKEND_API_BASE_URL;

function LoginPage() {
  /* SIGN-IN/SIGN-OUT TRIGGER VARIABLES */
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn(!isSignIn);
  /* USER INPUT VARIABLES */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState("");

  const [gilImage, setGilImage] = useState(gilLookUp);

  const navigate = useNavigate();

  const onFocusConfirmPassword = () => {
    setError("");
    setGilImage(gilLookDown);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) return;
    if (!isSignIn && (cPassword !== password)) {
      setError("Password does not match");
      setGilImage(gilLookFront);
    } else { navigate("/dashboard"); }
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
          <form
            key={isSignIn ? "signin" : "signup"}  // unmount/remount form when switching
            className="p-4 border rounded"
            style={{ minWidth: "300px" }}
            onSubmit={handleSubmit}
          >
            {/* HEADING */}
            <div className="text-center mb-3 text-dark">
              <h2>{isSignIn ? "Sign-in" : "Sign-up"}</h2>
            </div>

            {/* EMAIL ADDRESS */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setGilImage(gilLookRight)}
                onBlur={() => setGilImage(gilLookFront)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder={isSignIn ? "Password" : "Create password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setGilImage(gilLookDown)}
                onBlur={() => setGilImage(gilLookFront)}
                required
              />
            </div>

            {/* SIGN-IN: forgot password | SIGN-UP: confirm password */}
            {isSignIn && (
              <div className="mb-3 text-center">
                <a
                  href="https://static.tvtropes.org/pmwiki/pub/images/youfool_4226.png"
                  target="blank"
                  className="text-decoration-none"
                >
                  Forgot password?
                </a>
              </div>
            )}
            {!isSignIn && (
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  onFocus={onFocusConfirmPassword}
                  onBlur={() => setGilImage(gilLookUp)}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="submit-login btn w-100 mb-3 text-light">
              {isSignIn ? "Sign-in" : "Sign-up"}
            </button>

            {/* SWITCHING LOGIN PAGE */}
            <p className="text-center">
              {isSignIn ? (
                <>Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="btn btn-link p-0 text-decoration-none"
                  >
                    Sign-up
                  </button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="btn btn-link p-0 text-decoration-none"
                  >
                    Sign-in
                  </button>
                </>
              )}
            </p>

            {/* DIVIDER */}
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-3">OR</span>
              <hr className="flex-grow-1" />
            </div>

            {/* GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              className="google-login btn btn-secondary w-100 d-flex align-items-center justify-content-center"
              onClick={() =>
                window.open("https://accounts.google.com/o/oauth2/v2/auth", "blank", "noopener,noreferrer")
              } // need modify ^
            >
              <img
                src={googleLogo}
                alt="Google"
                className="google-logo"
              />
              <span>Login with Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
