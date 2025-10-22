import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au démarrage avec /api/me
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Appel à /users/me pour valider le token et récupérer le profil
    fetch("http://localhost:1337/api/users/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session invalide");
        const me = await res.json();
        setUser(me);
        setToken(storedToken);
        localStorage.setItem("user", JSON.stringify(me));
      })
      .catch(() => {
        // Token invalide → nettoyage
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
      })
      .finally(() => setLoading(false));
  }, []);

  // Connexion utilisateur
  const login = async (email, password) => {
    const response = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error?.message || "Erreur de connexion");

    setToken(data.jwt);
    localStorage.setItem("jwt", data.jwt);

    // Récupération du profil immédiatement
    const meRes = await fetch("http://localhost:1337/api/users/me", {
      headers: { Authorization: `Bearer ${data.jwt}` },
    });
    const me = await meRes.json();

    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  };

  // Inscription
  const register = async (username, email, password) => {
    const response = await fetch(
      "http://localhost:1337/api/auth/local/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error?.message || "Erreur d’inscription");

    setToken(data.jwt);
    localStorage.setItem("jwt", data.jwt);

    const meRes = await fetch("http://localhost:1337/api/users/me", {
      headers: { Authorization: `Bearer ${data.jwt}` },
    });
    const me = await meRes.json();

    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}