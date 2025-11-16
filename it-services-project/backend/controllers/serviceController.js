const serviceModel = require("../models/serviceModel");

const getServices = async (req, res) => {
  try {
    const services = await serviceModel.findAll();
    res.json({ status: "success", data: services });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const createService = async (req, res) => {
  const { nome, preco, prazo_dias } = req.body;
  if (!nome || preco === undefined || prazo_dias === undefined) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required." });
  }

  try {
    const newService = await serviceModel.create({ nome, preco, prazo_dias });
    res.status(201).json({ status: "success", data: newService });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getServices,
  createService,
};
