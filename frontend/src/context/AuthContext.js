import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Charger les infos sauvegardées au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("jwt");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Connexion utilisateur avec Strapi (port 1337)
  const login = async (email, password) => {
    const response = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Erreur de connexion");

    setUser(data.user);
    setToken(data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("jwt", data.jwt);
  };

  // Création de compte sur Strapi (port 1337)
  const register = async (username, email, password) => {
    const response = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "Erreur d’inscription");

    setUser(data.user);
    setToken(data.jwt);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("jwt", data.jwt);
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pratique pour consommer le contexte
export function useAuth() {
  return useContext(AuthContext);
}
