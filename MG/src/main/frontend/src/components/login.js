import { useState } from 'react';

import googleLogo from '../assets/google-logo.png';
import projectLogo from '../assets/emoji.png'

function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn(!isSignIn);

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Project name column */}
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

        {/* Form column */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <form className="p-4 border rounded bg-light" style={{ minWidth: "300px" }}>
            {/* Heading */}
            <div className="text-center mb-3">
              <h2>{isSignIn ? "Sign-in" : "Sign-up"}</h2>
            </div>

            {/* Email address */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder={isSignIn ? "Password" : "Create password"}
              />
            </div>

            {/* Sign-in: forgot password | Sign-up: confirm password */}
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
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm password"
                />
              </div>
            )}

            {/* Submit button */}
            <button type="submit" className="btn btn-primary w-100 mb-3">
              {isSignIn ? "Sign-in" : "Sign-up"}
            </button>

            {/* Switching login page */}
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

            {/* Divider */}
            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="mx-3">OR</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Google login button */}
            <button
              type="button"
              className="btn btn-secondary w-100 d-flex align-items-center justify-content-center"
              style={{ position: "relative" }}
              onClick={() => window.open("https://www.google.com", "blank", "noopener,noreferrer")}
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
