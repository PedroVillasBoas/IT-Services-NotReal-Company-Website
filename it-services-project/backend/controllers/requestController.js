const requestModel = require("../models/requestModel");

const getUserRequests = async (req, res) => {
  try {
    const clientId = req.user.id;
    const requests = await requestModel.findByClientId(clientId);
    res.json({ status: "success", data: requests });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateUserRequests = async (req, res) => {
  try {
    const clientId = req.user.id; // From middleware
    const { requests } = req.body;

    if (!Array.isArray(requests)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: 'Invalid data. "requests" must be an array.',
        });
    }

    await requestModel.batchUpdate(clientId, requests);

    res.json({ status: "success", message: "Requests updated successfully." });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getUserRequests,
  updateUserRequests,
};
