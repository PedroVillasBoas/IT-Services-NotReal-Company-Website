const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientModel = require("../models/clientModel");

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const loginClient = async (req, res) => {
  const { login, senha } = req.body;

  try {
    const client = await clientModel.findByEmail(login);

    if (client && (await bcrypt.compare(senha, client.senha_hash))) {
      res.json({
        status: "success",
        data: {
          id: client.id,
          nome: client.nome,
          email: client.email,
          token: generateToken(client.id, client.email),
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { login, senhaAtual, novaSenha } = req.body;

  try {
    const client = await clientModel.findByEmail(login);
    if (!client || !(await bcrypt.compare(senhaAtual, client.senha_hash))) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "Authentication failed. Check login or current password.",
        });
    }

    [cite_start];
    const updated = await clientModel.updatePassword(login, novaSenha);

    if (updated) {
      res.json({ status: "success", message: "Password changed successfully" });
    } else {
      throw new Error("Password update failed.");
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  loginClient,
  changePassword,
};
