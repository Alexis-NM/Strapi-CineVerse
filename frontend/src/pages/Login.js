import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth(); // on utilise la méthode du contexte
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home"; // fallback vers /home

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password); // le contexte s’occupe du fetch et du stockage
      console.log("Loged in with success");
      alert("Welcome to the party, pal !");
      navigate(from, { replace: true }); // redirection après login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center w-full min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-extrabold tracking-wider text-[#e50000] mb-2">
        Cineverse
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl text-gray-300 font-bold text-center mb-4">
          Connection
        </h2>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit">Log in</Button>
        <p className="text-sm text-center text-gray-300">
          New here ?{" "}
          <Link to="/register" className="text-[#e50000] hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
