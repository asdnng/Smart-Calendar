import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axiosSetup.js";

function CookiePage() {
  const navigate = useNavigate();
  const didRun = useRef(false); // guard against StrictMode double-effect

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        // small delay helps ensure the Set-Cookie from the redirect is applied
        await new Promise(r => setTimeout(r, 200));

        const res = await api.post("/jwt/exchange", {}, { withCredentials: true });
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Exchange failed:", err);
        alert("Authentication failed");
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  return <p>Logging you in...</p>;
}

export default CookiePage;