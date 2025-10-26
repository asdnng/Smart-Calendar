import { useState } from 'react';

import googleLogo from '../../assets/google-logo.png';

function SignUp({ onSwitch, onSubmit, onGoogle, setGil }) {
  const [email, setEmail] = useState("");  // being email and username, unique
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState("");

  const onFocusCPassword = () => {
    setError("");
    setGil("down");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (cPassword !== password) {
      setError("Password does not match");
      setGil("sus");
    } else {
      const at = email.indexOf('@');
      const name = email.slice(0, at);  // displayed name, later changable, non unique
      onSubmit({ email, password });
    }
  };

  return (
    <form
      className="p-4 border rounded"
      style={{ minWidth: "300px" }}
      onSubmit={handleSubmit}
    >
      {/* HEADING */}
      <div className="text-center mb-3 text-dark">
        <h2>Sign-up</h2>
      </div>

      {/* EMAIL ADDRESS */}
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setGil("right")}
          onBlur={() => setGil("front")}
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          id="inputPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setGil("down")}
          onBlur={() => setGil("front")}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          className={`form-control ${error ? "is-invalid" : ""}`}
          id="confirmPassword"
          placeholder="Confirm password"
          value={cPassword}
          onChange={(e) => setCPassword(e.target.value)}
          onFocus={onFocusCPassword}
          onBlur={() => setGil("up")}
          required
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>

      {/* SUBMIT BUTTON */}
      <button type="submit" className="submit-login btn w-100 mb-3 text-light">
        Sign-up
      </button>

      {/* SWITCHING TO SIGN-IN */}
      <p className="text-center">
        <>Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="btn btn-link p-0 text-decoration-none"
          >
            Sign-in
          </button>
        </>
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
        onClick={onGoogle}
      >
        <img
          src={googleLogo}
          alt="Google"
          className="google-logo"
        />
        <span>Login with Google</span>
      </button>
    </form>
  );
}

export default SignUp;