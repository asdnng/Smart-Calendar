import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CookiePage() {

    const navigate = useNavigate();

    useEffect(() => {

        const cookieToBody = async () => {

            try {

                const res = await fetch(`localhost:8080/jwt/exchange`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!res.ok) throw new Error("auth failure");

                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                navigate("/dashboard");

            } catch (err) {
                alert("failure");
                navigate("/login");
            }

        };

        cookieToBody();

    }, [navigate]);

    return (
        <p>login...</p>
    );
}

export default CookiePage;