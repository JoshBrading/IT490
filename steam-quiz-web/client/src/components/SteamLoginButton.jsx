import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SteamButton = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    window.location.href = "http://localhost:3001/api/auth/steam";
  };

  useEffect(() => {
    window.addEventListener("message", event => {
      if (event.origin !== "http://localhost:3001") return;

      const { token, ok } = event.data;
      if (ok) {
        localStorage.setItem("jwtToken", token);
        console.log(token);
        window.close();
      }
    });
  }, []);

  return (
    <div className="App">
      <img
        onClick={handleLogin}
        src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
        alt="Login with Steam"
      />
    </div>
  );
};

export default SteamButton;