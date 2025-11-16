import { useState, useEffect, useMemo } from "react";
import apiClient from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

// Helper to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "--/--/----";
  // Handles both Date objects and YYYY-MM-DD strings
  const date = new Date(dateString.replace(/-/g, "/"));
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export default function CartPage() {
  const { user } = useAuth(); // Get logged-in user's name
  const userEmail = localStorage.getItem("userEmail"); // Assuming email is stored on login

  // State
  const [availableServices, setAvailableServices] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetching initial data (available services AND user's requests)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, requestsRes] = await Promise.all([
          apiClient.get("/services"),
          apiClient.get("/requests"), // This is a protected route
        ]);

        setAvailableServices(servicesRes.data.data);

        // Mapping backend data to frontend state
        const mappedRequests = requestsRes.data.data.map((req) => ({
          id: req.solicitacao_id,
          data_pedido: req.data_pedido,
          numero_solicitacao: req.numero_solicitacao,
          servico_nome: req.servico_nome,
          status: req.status,
          preco_cobrado: req.servico_preco,
          data_prevista: req.data_prevista,
        }));
        setUserRequests(mappedRequests);
      } catch (error) {
        setMessage({ type: "error", text: "Erro ao carregar dados." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedService = useMemo(() => {
    return availableServices.find(
      (s) => s.id === parseInt(selectedServiceId, 10)
    );
  }, [selectedServiceId, availableServices]);

  const expectedDate = useMemo(() => {
    if (!selectedService) return null;
    const today = new Date();
    today.setDate(today.getDate() + selectedService.prazo_dias);
    return today;
  }, [selectedService]);

  const handleAddRequest = (e) => {
    e.preventDefault();
    if (!selectedService) {
      setMessage({ type: "error", text: "Por favor, selecione um serviço." });
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const newRequest = {
      id: `temp-${Date.now()}`,
      servico_id: selectedService.id,
      data_pedido: today,
      numero_solicitacao: `SRV-${String(userRequests.length + 1).padStart(
        3,
        "0"
      )}`,
      servico_nome: selectedService.nome,
      status: "EM ELABORAÇÃO",
      preco_cobrado: selectedService.preco,
      data_prevista: expectedDate.toISOString().split("T")[0],
    };

    setUserRequests((prev) => [...prev, newRequest]);
    setSelectedServiceId("");
    setMessage({ type: "success", text: "Serviço incluído na lista." });
  };

  const handleDeleteRequest = (id) => {
    setUserRequests((prev) => prev.filter((req) => req.id !== id));
    setMessage({ type: "success", text: "Serviço removido da lista." });
  };

  const handleUpdateDatabase = async () => {
    setMessage({ type: "info", text: "Salvando..." });

    // Map frontend state to backend-expected format
    const requestsToSave = userRequests.map((req) => ({
      servico_id:
        req.servico_id ||
        availableServices.find((s) => s.nome === req.servico_nome)?.id,
      data_pedido: req.data_pedido,
      numero_solicitacao: req.numero_solicitacao,
      status: req.status,
      preco_cobrado: req.preco_cobrado,
      data_prevista: req.data_prevista,
    }));

    try {
      await apiClient.put("/requests", {
        requests: requestsToSave,
      });
      setMessage({ type: "success", text: "Suas solicitações foram salvas!" });
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar solicitações." });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <main className="flex-grow p-4 md:p-8">
      <div className="container max-w-4xl mx-auto space-y-8">
        <h2 className="form-title text-center">Suas Solicitações de Serviço</h2>

        <section className="user-info p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">
            Informações do Usuário
          </h3>
          <p>
            <strong>Nome:</strong>{" "}
            <span id="loggedInUserName">{user || "Convidado"}</span>
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <span id="loggedInUserEmail">{userEmail || "..."}</span>
          </p>
        </section>

        <section className="previous-requests p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">
            Solicitações Anteriores
          </h3>
          <div className="overflow-x-auto">
            <table
              className="requests-table w-full text-left"
              id="requestsTable"
            >
              <thead>
                <tr>
                  <th>Data Pedido</th>
                  <th>Número</th>
                  <th>Serviço</th>
                  <th>Status</th>
                  <th>Preço</th>
                  <th>Data Esperada</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      Nenhuma solicitação encontrada.
                    </td>
                  </tr>
                ) : (
                  userRequests.map((req) => (
                    <tr key={req.id}>
                      <td>{formatDate(req.data_pedido)}</td>
                      <td>{req.numero_solicitacao}</td>
                      <td>{req.servico_nome}</td>
                      <td>{req.status}</td>
                      <td>{formatCurrency(req.preco_cobrado)}</td>
                      <td>{formatDate(req.data_prevista)}</td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteRequest(req.id)}
                          title="Remover"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-primary w-full mt-6"
            onClick={handleUpdateDatabase}
          >
            Salvar Alterações no Servidor
          </button>
        </section>

        <section className="new-request p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">
            Criar Nova Solicitação
          </h3>
          <form
            id="newRequestForm"
            className="space-y-4"
            noValidate
            onSubmit={handleAddRequest}
          >
            <div>
              <label htmlFor="serviceSelect" className="form-label">
                Serviço:
              </label>
              <select
                id="serviceSelect"
                className="form-select w-full"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                <option value="">Selecione um serviço</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Preço:</label>
                <span className="form-input-display">
                  {formatCurrency(selectedService?.preco)}
                </span>
              </div>
              <div>
                <label className="form-label">Prazo (dias):</label>
                <span className="form-input-display">
                  {selectedService?.prazo_dias || 0}
                </span>
              </div>
            </div>
            <div>
              <label className="form-label">Data Esperada:</label>
              <span className="form-input-display">
                {formatDate(expectedDate)}
              </span>
            </div>
            <div>
              <label className="form-label">Status:</label>
              <span className="form-input-display">EM ELABORAÇÃO</span>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Incluir Solicitação na Lista
            </button>
          </form>
        </section>

        {message.text && (
          <p
            className={`validation-message text-center ${
              message.type === "error" ? "error" : "success"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </main>
  );
}
