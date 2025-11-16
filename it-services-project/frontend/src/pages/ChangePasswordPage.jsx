import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validation";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    login: "",
    senhaAtual: "",
    novaSenha: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      login: "",
      senhaAtual: "",
      novaSenha: "",
      confirmNewPassword: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage({ type: "", text: "" });

    // --- Client-side Validation ---
    const newErrors = {};
    newErrors.login = validateEmail(formData.login);
    newErrors.senhaAtual = !formData.senhaAtual
      ? "Senha atual é obrigatória."
      : "";
    newErrors.novaSenha = validatePassword(formData.novaSenha);
    newErrors.confirmNewPassword = validatePasswordMatch(
      formData.novaSenha,
      formData.confirmNewPassword
    );

    const validErrors = Object.entries(newErrors).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    if (Object.keys(validErrors).length > 0) {
      setErrors(validErrors);
      setMessage({ type: "error", text: "Por favor, corrija os erros." });
      return;
    }

    // --- API Call ---
    const { login, senhaAtual, novaSenha } = formData;
    try {
      await apiClient.put("/auth/change-password", {
        login,
        senhaAtual,
        novaSenha,
      });

      setMessage({
        type: "success",
        text: "Senha alterada com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
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
        <h2 className="form-title">Alterar Senha</h2>
        <form
          id="changePasswordForm"
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="changeEmail" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="changeEmail"
              name="login"
              className="form-input"
              autoFocus
              required
              value={formData.login}
              onChange={handleChange}
            />
            {errors.login && <p className="error-message">{errors.login}</p>}
          </div>

          <div>
            <label htmlFor="currentPassword" className="form-label">
              Senha Atual:
            </label>
            <input
              type="password"
              id="currentPassword"
              name="senhaAtual"
              className="form-input"
              required
              value={formData.senhaAtual}
              onChange={handleChange}
            />
            {errors.senhaAtual && (
              <p className="error-message">{errors.senhaAtual}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="form-label">
              Nova Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              name="novaSenha"
              className="form-input"
              required
              value={formData.novaSenha}
              onChange={handleChange}
            />
            {errors.novaSenha && (
              <p className="error-message">{errors.novaSenha}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirmar Nova Senha:
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className="form-input"
              required
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
            {errors.confirmNewPassword && (
              <p className="error-message">{errors.confirmNewPassword}</p>
            )}
          </div>

          <div className="password-rules text-sm">
            <p className="font-bold mb-2">Regras de Senha:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mínimo 6 caracteres.</li>
              <li>Pelo menos um caractere numérico.</li>
              <li>Pelo menos uma letra maiúscula.</li>
              <li>Pelo menos um caractere especial permitido.</li>
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary">
              Alterar Senha
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearForm}
            >
              Limpar
            </button>
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
