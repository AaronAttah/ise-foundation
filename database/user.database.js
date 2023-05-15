const User = require("../models/user");

exports.findOneByEmail = async (filter) => {
  const user = await User.findOne({ email: filter });
  return user;
};
exports.findOneById = async (filter) => {
  const user = await User.findOne({ _id: filter });
  return user;
};

exports.create = async (data) => {
  const user = await User.create(data);
  return user;
};
