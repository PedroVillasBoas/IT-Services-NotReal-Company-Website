import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/axios";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateFullName,
  validateCpf,
  validateAge,
  maskCpf,
  maskDate,
} from "../utils/validation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    confirmPassword: "",
    nome: "",
    cpf: "",
    data_nascimento: "",
    telefone: "", // Optional
    estado_civil: "solteiro", // Default
    escolaridade: "2_completo", // Default
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaskedChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "cpf") {
      maskedValue = maskCpf(value);
    } else if (name === "data_nascimento") {
      maskedValue = maskDate(value);
    }
    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const clearForm = () => {
    setFormData({
      email: "",
      senha: "",
      confirmPassword: "",
      nome: "",
      cpf: "",
      data_nascimento: "",
      telefone: "",
      estado_civil: "solteiro",
      escolaridade: "2_completo",
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
    newErrors.email = validateEmail(formData.email);
    newErrors.senha = validatePassword(formData.senha);
    newErrors.confirmPassword = validatePasswordMatch(
      formData.senha,
      formData.confirmPassword
    );
    newErrors.nome = validateFullName(formData.nome);
    newErrors.cpf = validateCpf(formData.cpf);
    newErrors.data_nascimento = validateAge(formData.data_nascimento);

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
    const apiData = { ...formData };
    delete apiData.confirmPassword;

    try {
      await apiClient.post("/clients/register", apiData);

      setMessage({
        type: "success",
        text: "Registro concluído! Redirecionando para o login...",
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
          <img src="/assets/logo.png" alt="Company Logo" />
        </div>
        <h2 className="form-title">Registro de Cliente</h2>
        <form
          id="registerForm"
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="registerEmail" className="form-label">
              Email:
            </label>
            <input
              type="email"
              id="registerEmail"
              name="email"
              className="form-input"
              autoFocus
              required
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="registerPassword" className="form-label">
              Senha:
            </label>
            <input
              type="password"
              id="registerPassword"
              name="senha"
              className="form-input"
              required
              value={formData.senha}
              onChange={handleChange}
            />
            {errors.senha && <p className="error-message">{errors.senha}</p>}
          </div>

          <div>
            <label htmlFor="confirmRegisterPassword" className="form-label">
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmRegisterPassword"
              name="confirmPassword"
              className="form-input"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
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

          <div>
            <label htmlFor="fullName" className="form-label">
              Nome Completo:
            </label>
            <input
              type="text"
              id="fullName"
              name="nome"
              className="form-input"
              required
              value={formData.nome}
              onChange={handleChange}
            />
            {errors.nome && <p className="error-message">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="cpf" className="form-label">
              CPF:
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              className="form-input"
              required
              maxLength="14"
              value={formData.cpf}
              onChange={handleMaskedChange}
            />
            {errors.cpf && <p className="error-message">{errors.cpf}</p>}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="form-label">
              Data de Nascimento:
            </label>
            <input
              type="text"
              id="dateOfBirth"
              name="data_nascimento"
              className="form-input"
              placeholder="DD/MM/YYYY"
              required
              maxLength="10"
              value={formData.data_nascimento}
              onChange={handleMaskedChange}
            />
            {errors.data_nascimento && (
              <p className="error-message">{errors.data_nascimento}</p>
            )}
          </div>

          <div>
            <label htmlFor="cellphone" className="form-label">
              Celular/WhatsApp (Opcional):
            </label>
            <input
              type="tel"
              id="cellphone"
              name="telefone"
              className="form-input"
              placeholder="(XX) XXXXX-XXXX"
              value={formData.telefone}
              onChange={handleChange}
            />
            {errors.telefone && (
              <p className="error-message">{errors.telefone}</p>
            )}
          </div>

          <div>
            <label className="form-label">Estado Civil:</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: "Solteiro", value: "solteiro" },
                { label: "Casado", value: "casado" },
                { label: "Divorciado", value: "divorciado" },
                { label: "Viúvo", value: "viuvo" },
              ].map((status) => (
                <label key={status.value} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="estado_civil"
                    value={status.value}
                    className="form-radio"
                    checked={formData.estado_civil === status.value}
                    onChange={handleChange}
                  />
                  <span className="ml-2">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="schooling" className="form-label">
              Escolaridade:
            </label>
            <select
              id="schooling"
              name="escolaridade"
              className="form-select"
              value={formData.escolaridade}
              onChange={handleChange}
            >
              <option value="1_incompleto">1º grau incompleto</option>
              <option value="1_completo">1º grau completo</option>
              <option value="2_completo">2º grau completo</option>
              <option value="superior">Nível Superior</option>
              <option value="pos_graduado">Pós-graduado</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary">
              Incluir
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearForm}
            >
              Limpar
            </button>
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() => navigate(-1)}
            >
              Voltar
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
