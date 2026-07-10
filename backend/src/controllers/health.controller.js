const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrepPulse Backend Running',
  });
};

module.exports = {
  getHealthStatus,
};
