import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, AlertCircle } from "lucide-react";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErrorDetails("");
    
    if (!email.trim() || !password.trim()) {
      setMsg("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      console.log("Tentando login com:", { email, password });
      const res = await api.post("/auth/login", { email, password });
      console.log("Login bem-sucedido:", res.data);
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "E-mail ou senha incorretos";
      setMsg(errorMsg);
      
      // Mostrar detalhes do erro para debug
      if (err.response?.status === 400) {
        setErrorDetails(`Status 400 - Dados inválidos. Verifique se o backend espera esses campos.`);
      } else if (err.code === 'ERR_NETWORK') {
        setErrorDetails("Erro de rede - Backend pode estar desligado na porta 3000");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="logo-area">🚀 FitLog</div>
        <h2 className="title-style">Bem-vindo de volta</h2>
        
        <input 
          className="input-style" 
          type="email"
          placeholder="E-mail" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input 
          className="input-style" 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg && (
          <div>
            <p className="error-msg">{msg}</p>
            {errorDetails && <p className="error-details">{errorDetails}</p>}
          </div>
        )}
        
        <p className="footer-text">
          Não tem conta? <Link to="/register" className="link-style">Crie uma agora</Link>
        </p>
      </form>
    </div>
  );
}