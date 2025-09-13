import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../cssModules/login.css';

import googleLogo from '../assets/google-logo.png';
import projectLogo from '../assets/emoji.png';


function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn(!isSignIn);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) return;

    if (!isSignIn && (cPassword !== password)) {
      setError("Password does not match");
    } else { navigate("/dashboard"); }
  };

//  const googleLogin = () => {
//      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?
//  		client_id=${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
//  		&redirect_uri=${process.env.REACT_APP_GOOGLE_AUTH_REDIRECT_URI}
//  		&response_type=code
//  		&scope=email profile`;
//  };

  return (
    <div className="container-fluid vh-100 bg-dark">
      <div className="row h-100">
        {/* PROJECT NAME COLUMN */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="d-flex flex-row flex-md-column align-items-center">
            <h1 className="text-white me-3 me-md-0 mb-md-3">MG project</h1>
            <img
              src={projectLogo}
              alt="MG"
              style={{ width: "50px" }}
            />
          </div>
        </div>

        {/* FORM COLUMN */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <form
            key={isSignIn ? "signin" : "signup"}  // unmount/remount form when switching
            className="p-4 border rounded bg-light"
            style={{ minWidth: "300px" }}
            onSubmit={handleSubmit}
          >
            {/* HEADING */}
            <div className="text-center mb-3">
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
                  onFocus={() => setError("")}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn btn-primary w-100 mb-3">
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
              className="btn btn-secondary w-100 d-flex align-items-center justify-content-center"
              style={{ position: "relative" }}
              onClick={() => window.open("https://accounts.google.com/o/oauth2/v2/auth", "blank", "noopener,noreferrer")} //have to modify later
            >
              <img
                src={googleLogo}
                alt="Google"
                style={{
                  position: "absolute",
                  left: "12px",
                  width: "20px",
                  height: "20px"
                }}
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
