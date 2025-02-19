import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  /*Gestion de la soumission du formulaire de connexion*/
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSuccess("Login successful!");
        login(data.token, data.user_id);
        navigate("/accueil");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <h1 className="welcome-text">Bienvenue !</h1>
        <p className="subtitle">Vous êtes déjà utilisateur ?</p>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <p className="forgot-password">Mot de passe oublié ?</p>
        <div className="divider" />
        <button
          type="button"
          className="create-account-button"
          onClick={() => navigate("/register")}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}

export default Login;
