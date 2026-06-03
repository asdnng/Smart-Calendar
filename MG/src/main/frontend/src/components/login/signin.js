import { useState } from 'react';

import googleLogo from '../../assets/google-logo.png';

function SignIn({ onSwitch, onSubmit, onGoogle, setGil }) {
  const [usern ame, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form
      className="p-4 border rounded"
      style={{ minWidth: "300px" }}
      onSubmit={handleSubmit}
    >
      {/* HEADING */}
      <div className="text-center mb-3 text-dark">
        <h2>Sign-in</h2>
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

      <div className="mb-3 text-center">
        <a
          href="https://static.tvtropes.org/pmwiki/pub/images/youfool_4226.png"
          target="blank"
          className="text-decoration-none"
        >
          Forgot password?
        </a>
      </div>

      {/* SUBMIT BUTTON */}
      <button type="submit" className="submit-login btn w-100 mb-3 text-light">
        Sign-in
      </button>

      {/* SWITCHING TO SIGN-UP */}
      <p className="text-center">
        <>Don't have an account yet?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="btn btn-link p-0 text-decoration-none"
          >
            Sign-up
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

export default SignIn;