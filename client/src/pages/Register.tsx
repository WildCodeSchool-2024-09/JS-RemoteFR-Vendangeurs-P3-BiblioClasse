import { useState } from "react";
import Header from "../components/Header";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleAlreadyAccount = () => {
    navigate("/");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3310/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom, prenom, email, password }),
      });
      if (response.ok) {
        setSuccess("Registration successful!");
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (error) {}
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <h1 className="title">Créer un compte</h1>
        <form className="register-form" onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Prenom"
            className="input-field"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          <input
            type="text"
            placeholder="nom"
            className="input-field"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="register-button">
            S'inscrire
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <p
          onClick={handleAlreadyAccount}
          onKeyDown={handleAlreadyAccount}
          className="already-account"
        >
          Vous avez déjà un compte ?
        </p>
      </div>
    </div>
  );
}

export default Register;
