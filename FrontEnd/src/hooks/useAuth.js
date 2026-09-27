import { useState, useEffect } from "react";
import { login, register } from "../api.js";

const TOKEN_KEY = "celluloid-token";
const CODE_KEY = "celluloid-code";

export function useAuth() {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [celluloidCode, setCelluloidCode] = useState(() =>
    localStorage.getItem(CODE_KEY)
  );

    useEffect(() => {
        const savedCode = localStorage.getItem(CODE_KEY);
        const savedToken = localStorage.getItem(TOKEN_KEY);

        if (savedToken) {
            return;
        }

        if (!savedCode) {
            return;
        }

        handleLogin(savedCode).catch(() => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(CODE_KEY);
            setToken(null);
            setCelluloidCode(null);
        });
    }, []);

  async function handleLogin(code) {
    const data = await login(code);

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(CODE_KEY, code);

    setToken(data.token);
    setCelluloidCode(code);

    return data;
  }

  async function handleRegister(personalCode) {
    const data = await register(personalCode);

    await handleLogin(data.celluloidCode);

    return data;
    }   

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CODE_KEY);

    setToken(null);
    setCelluloidCode(null);
  }

  return {
    token,
    celluloidCode,
    isLoggedIn: !!token,
    login: handleLogin,
    register: handleRegister,
    logout
  };
}