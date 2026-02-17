import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import "../styles/auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    // Validações
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMsg("Por favor, preencha todos os campos");
      return;
    }

    if (password !== passwordConfirm) {
      setMsg("As senhas não correspondem");
      return;
    }

    if (password.length < 6) {
      setMsg("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!email.includes("@")) {
      setMsg("Por favor, insira um e-mail válido");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      setMsg("✓ Conta criada com sucesso! Redirecionando...");
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <div className="logo-area">🚀 FitLog</div>
        <h2 className="title-style">Crie sua conta</h2>

        <input 
          className="input-style" 
          type="text"
          placeholder="Nome Completo" 
          value={name} 
          onChange={e => setName(e.target.value)}
          disabled={loading}
          required
        />
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
        <input 
          className="input-style" 
          type="password" 
          placeholder="Confirmar Senha" 
          value={passwordConfirm} 
          onChange={e => setPasswordConfirm(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Criando..." : "Cadastrar"}
        </button>

        {msg && (
          <p className={msg.includes("sucesso") || msg.includes("✓") ? "success-msg" : "error-msg"}>
            {msg}
          </p>
        )}

        <p className="footer-text">
          Já tem uma conta? <Link to="/login" className="link-style">Faça login</Link>
        </p>
      </form>
    </div>
  );
}