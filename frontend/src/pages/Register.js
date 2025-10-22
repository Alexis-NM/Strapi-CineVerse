import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const { register } = useAuth(); // 👈 On récupère la fonction du contexte
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Vérification locale du mot de passe avant d’appeler Strapi
    if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
    }

    try {
      await register(username, email, password); // Appel centralisé
      console.log("✅ Compte créé avec succès");
      setSuccess(true);
      alert("Votre compte a bien été créé !");
      window.location.href = "/login"; // regirection vers la page de connexion
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
        <h2 className="text-3xl text-gray-300 font-bold text-center mb-4">Create an account</h2>
        <p className="text-center text-gray-300 mb-4">Join us in a few sec !</p>

        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <Button type="submit">Create my account</Button>

        <p className="text-sm text-center text-gray-300">
          Already have an account ?{" "}
          <a href="/login" className="text-[#e50000] hover:underline">
            Log in here !
          </a>
        </p>
      </form>
    </div>
  );
}
