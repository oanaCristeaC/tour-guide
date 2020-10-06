// User logic
exports.checkId = (req, res, next, val) => {
  const id = req.param.id;

  if (!id) {
    return res.sendStatus(404);
  }
};

exports.getUsers = (req, res) => {
  res.sendStatus(500);
};

exports.createUser = (req, res) => {
  res.sendStatus(500);
};

exports.getUser = (req, res) => {
  res.sendStatus(500);
};

exports.deleteUser = (req, res) => {
  res.sendStatus(500);
};

exports.updateUser = (req, res) => {
  res.sendStatus(500);
};
