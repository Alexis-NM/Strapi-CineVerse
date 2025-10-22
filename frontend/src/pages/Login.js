import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth(); // 👈 on utilise la méthode du contexte
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/actors"; // fallback vers /home

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password); // 👈 le contexte s’occupe du fetch et du stockage
      console.log("✅ Connecté avec succès");
      alert("Connexion réussie !");
      navigate(from, { replace: true }); // ⬅️ redirection après login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">Se connecter</Button>
        <p className="text-sm text-center text-gray-500">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}