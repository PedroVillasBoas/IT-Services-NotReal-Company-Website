const clientModel = require("../models/clientModel");

const registerClient = async (req, res) => {
  try {
    [cite_start];
    const existingClient = await clientModel.findByEmail(req.body.email);
    if (existingClient) {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered.",
      });
    }

    const newClient = await clientModel.create(req.body);

    res.status(201).json({ status: "success", data: newClient });
  } catch (error) {
    if (error.code === "23505" && error.constraint === "cliente_cpf_key") {
      return res
        .status(400)
        .json({ status: "error", message: "This CPF is already registered." });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  registerClient,
};
