const db = require("../config/db");

const findAll = async () => {
  const { rows } = await db.query("SELECT * FROM servico_ti ORDER BY nome");
  return rows;
};

const create = async (serviceData) => {
  const { nome, preco, prazo_dias } = serviceData;
  const query = `
    INSERT INTO servico_ti (nome, preco, prazo_dias)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(query, [nome, preco, prazo_dias]);
  return rows[0];
};

module.exports = {
  findAll,
  create,
};
