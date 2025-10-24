import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import { validateEmail, validatePassword } from "../utils/validators";
import logoMark from "../assets/cineverse-logo.png";

export default function Login() {
  const { login } = useAuth(); // on utilise la méthode du contexte
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home"; // fallback vers /home

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Invalid password. Please check the requirements.");
      return;
    }

    try {
      await login(email, password); // le contexte s’occupe du fetch et du stockage
      console.log("Loged in with success");
      setShowModal(true); // affiche la modale
      } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(from, { replace: true }); // redirection après fermeture
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }} // Démarre un peu plus haut et invisible
        animate={{ opacity: 1, y: 0 }} // Devient visible et descend à sa place
        transition={{ duration: 0.6, ease: "easeOut" }} // Durée + courbe fluide
      >
        <img
          src={logoMark}
          alt="Cineverse logo"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover drop-shadow-[0_0_24px_rgba(229,0,0,0.6)]"
        />
        <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[0.35em] uppercase text-white">
          Cineverse
        </h1>
      </motion.div>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
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
        <Button type="submit" disabled={!isFormValid}>Log in</Button>
        <p className="text-sm text-center text-gray-300">
          New here ?{" "}
          <Link to="/register" className="text-[#e50000] hover:underline">
            Create an account
          </Link>
        </p>
      </motion.form>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Welcome to the party, pal !"
        message="You're now logged in. Let's explore Cineverse!"
      />
    </div>
  );
}
