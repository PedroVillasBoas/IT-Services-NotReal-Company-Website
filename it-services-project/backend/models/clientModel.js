const db = require("../config/db");
const bcrypt = require("bcryptjs");

const findByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM cliente WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const create = async (clientData) => {
  const {
    email,
    senha,
    nome,
    cpf,
    data_nascimento,
    telefone,
    estado_civil,
    escolaridade,
  } = clientData;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(senha, salt);

  const query = `
    INSERT INTO cliente (email, senha_hash, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, nome
  `;
  const values = [
    email,
    hashedPassword,
    nome,
    cpf,
    data_nascimento,
    telefone,
    estado_civil,
    escolaridade,
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updatePassword = async (email, newPassword) => {
  // Hashing new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const { rowCount } = await db.query(
    "UPDATE cliente SET senha_hash = $1 WHERE email = $2",
    [hashedPassword, email]
  );
  return rowCount; // Returns 1 if successful, 0 if not
};

module.exports = {
  findByEmail,
  create,
  updatePassword,
};
