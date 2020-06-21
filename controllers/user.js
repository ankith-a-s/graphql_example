const Users = require('../models/user');

async function createUser(userData) {
  return await Users.create(userData, []);
}

async function findUserByEmail(emailId) {
  return await Users.findOne({ email: emailId }).populate('createFiles');
}

async function updateUserByUserId({ userData, userId, user }) {
  await Users.updateOne({ _id: userId }, { $set: userData });
  let updatedUser = await Users.findOne({ email: user.email }).populate('createFiles');
  return updatedUser;
}

module.exports = {
  findUserByEmail,
  createUser,
  updateUserByUserId,
};
