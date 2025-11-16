import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

export default function AdminCreateServicePage() {
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    prazo_dias: "",
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
      nome: "",
      preco: "",
      prazo_dias: "",
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
    if (!formData.nome) newErrors.nome = "Nome do serviço é obrigatório.";
    if (!formData.preco || parseFloat(formData.preco) <= 0)
      newErrors.preco = "Preço deve ser um número positivo.";
    if (!formData.prazo_dias || parseInt(formData.prazo_dias, 10) <= 0)
      newErrors.prazo_dias = "Prazo deve ser um número positivo.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage({ type: "error", text: "Por favor, corrija os erros." });
      return;
    }

    // --- API Call ---
    const apiData = {
      ...formData,
      preco: parseFloat(formData.preco),
      prazo_dias: parseInt(formData.prazo_dias, 10),
    };

    try {
      await apiClient.post("/services", apiData);

      setMessage({ type: "success", text: "Serviço criado com sucesso!" });
      clearForm();

      // setTimeout(() => navigate('/cart'), 1500);
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
        <h2 className="form-title">(Admin) Criar Novo Serviço de TI</h2>
        <form
          id="createServiceForm"
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="nome" className="form-label">
              Nome do Serviço:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="form-input"
              autoFocus
              required
              value={formData.nome}
              onChange={handleChange}
            />
            {errors.nome && <p className="error-message">{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="preco" className="form-label">
              Preço (R$):
            </label>
            <input
              type="number"
              id="preco"
              name="preco"
              className="form-input"
              required
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={handleChange}
            />
            {errors.preco && <p className="error-message">{errors.preco}</p>}
          </div>

          <div>
            <label htmlFor="prazo_dias" className="form-label">
              Prazo (em dias):
            </label>
            <input
              type="number"
              id="prazo_dias"
              name="prazo_dias"
              className="form-input"
              required
              min="0"
              step="1"
              value={formData.prazo_dias}
              onChange={handleChange}
            />
            {errors.prazo_dias && (
              <p className="error-message">{errors.prazo_dias}</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button type="submit" className="btn btn-primary">
              Criar Serviço
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
