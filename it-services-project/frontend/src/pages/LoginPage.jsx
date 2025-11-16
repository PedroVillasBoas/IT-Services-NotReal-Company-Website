import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../api/axios";
import { validateEmail } from "../utils/validation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const { login } = useAuth();

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage({ type: "", text: "" });

    // Client-side validation
    const emailError = validateEmail(email);
    const passError = !password ? "Senha é obrigatória." : "";
    const newErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passError) newErrors.password = passError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: "error", text: "Por favor, corrija os erros." });
      return;
    }

    // API Call
    try {
      const response = await apiClient.post("/auth/login", {
        login: email,
        senha: password,
      });

      // On Success
      const { token, nome } = response.data.data;
      login(token, nome); // Save token and user to context
      setMessage({ type: "success", text: "Login bem-sucedido!" });

      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      // On Error
      const apiError = error.response?.data?.message || "Erro no servidor.";
      setMessage({ type: "error", text: apiError });
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="form-container">
        <div className="form-logo">
          <img src="/assets/logo.png" alt="Company Logo" className="h-16" />
        </div>
        <h2 className="form-title">Login Cliente</h2>
        <form
          id="loginForm"
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="loginEmail" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="loginEmail"
              className="form-input"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="loginPassword" className="form-label">
              Senha:
            </label>
            <input
              type="password"
              id="loginPassword"
              className="form-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearForm}
            >
              Limpar
            </button>
          </div>
          <div className="text-center text-sm mt-4">
            {/* Links will be added in the next step */}
          </div>
          {message.text && (
            <p
              className={`validation-message ${
                message.type === "error" ? "error" : "success"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
