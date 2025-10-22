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
      // Optionnel : rediriger, par exemple vers la page de connexion :
      // window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="bg-[#141414] min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Créer un compte</h2>
        <p className="text-center text-gray-500 mb-4">Rejoignez-nous en quelques secondes 🚀</p>

        <Input label="Nom complet" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <Button type="submit">Créer mon compte</Button>

        <p className="text-sm text-center text-gray-500">
          Vous avez déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}
