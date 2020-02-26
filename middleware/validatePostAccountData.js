module.exports = data => {
  return (req, res, next) => {
    const { name, budget } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name of account is required.' });
    }
    if (!budget) {
      return res
        .status(400)
        .json({ message: 'budget of account is required.' });
    }

    next();
  };
};
