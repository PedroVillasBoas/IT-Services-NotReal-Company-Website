const db = require("../config/db");

// Finding all requests for a specific client
const findByClientId = async (clientId) => {
  const query = `
    SELECT
      sr.id AS solicitacao_id,
      sr.data_pedido,
      sr.numero_solicitacao,
      sr.status,
      sr.data_prevista,
      st.nome AS servico_nome,
      st.preco AS servico_preco
    FROM solicitacao_servico sr
    JOIN servico_ti st ON sr.servico_id = st.id
    WHERE sr.cliente_id = $1
    ORDER BY sr.data_pedido ASC
  `;
  const { rows } = await db.query(query, [clientId]);
  return rows;
};

const batchUpdate = async (clientId, requests) => {
  const client = await db.pool.connect();
  try {
    // Starting transaction
    await client.query("BEGIN");

    [cite_start];
    await client.query(
      "DELETE FROM solicitacao_servico WHERE cliente_id = $1",
      [clientId]
    );

    [cite_start];
    if (requests && requests.length > 0) {
      const insertQuery = `
        INSERT INTO solicitacao_servico (
          cliente_id, servico_id, data_pedido, numero_solicitacao, status, preco_cobrado, data_prevista
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      // Promise.all to run all insert queries
      await Promise.all(
        requests.map((req) => {
          const values = [
            clientId,
            req.servico_id,
            req.data_pedido,
            req.numero_solicitacao,
            req.status,
            req.preco_cobrado,
            req.data_prevista,
          ];
          return client.query(insertQuery, values);
        })
      );
    }

    // Committing transaction
    await client.query("COMMIT");
    return { status: "success" };
  } catch (e) {
    // Rollback on error
    await client.query("ROLLBACK");
    throw e;
  } finally {
    // Releasing client back to the pool
    client.release();
  }
};

module.exports = {
  findByClientId,
  batchUpdate,
};
