import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import {
  validateEmail,
  validatePassword,
  checkEmailExists,
} from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Bouton activé/désactivé sans dépendre de l'objet d'erreurs,
  // ce qui évite l'inversion de logique vue précédemment.
  const canSubmit =
    !loading &&
    username.trim() !== "" &&
    validateEmail(email) &&
    validatePassword(password) &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {};
    setLoading(true);

    // Validations "submit-time" pour afficher les messages d'erreur
    if (username.trim() === "") newError.username = "Username is required.";

    if (!validateEmail(email)) {
      newError.email = "Please enter a valid email address.";
    } else {
      const emailUsed = await checkEmailExists(email);
      if (emailUsed)
        newError.email = "This email is already used by another user.";
    }

    if (!validatePassword(password)) {
      newError.password =
        "Password must have at least 8 characters, one uppercase letter, and one number.";
    }

    if (password !== confirmPassword) {
      newError.confirmPassword = "Passwords do not match.";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await register(username.trim(), email, password);
      setShowModal(true);
    } catch (err) {
      const errorMessage = err?.message || err?.response?.data?.error?.message;
      if (
        errorMessage?.toLowerCase().includes("email") &&
        errorMessage?.toLowerCase().includes("taken")
      ) {
        setError((prev) => ({
          ...prev,
          email: "This email is already used by another user.",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          global: "An error occurred during registration.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black">
      <motion.h1
        className="text-6xl font-extrabold tracking-wider text-[#e50000] mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Cineverse
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-3"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <h2 className="text-3xl text-gray-300 font-bold text-center mb-2">
          Create an account
        </h2>
        <p className="text-center text-gray-300 mb-4">Join us in a few sec!</p>

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error.username && (
          <p className="text-red-500 text-sm">{error.username}</p>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error.email && <p className="text-red-500 text-sm">{error.email}</p>}

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error.password && (
          <p className="text-red-500 text-sm">{error.password}</p>
        )}

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error.confirmPassword && (
          <p className="text-red-500 text-sm">{error.confirmPassword}</p>
        )}

        {error.global && (
          <p className="text-red-500 text-sm text-center">{error.global}</p>
        )}

        <Button type="submit" disabled={!canSubmit}>
          {loading ? "Creating..." : "Create my account"}
        </Button>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-[#e50000] hover:underline">
            Log in here!
          </a>
        </p>
      </motion.form>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Account Created! ✅"
        message="Your Cineverse account is ready. You can now log in."
      />
    </div>
  );
}
