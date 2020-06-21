const User = require('../models/user');
const File = require('../models/file')

const files = async (fileIds) => {
  try {
    const files = await File.find({ _id: { $in: fileIds } });
    return files.map((file) => {
      return {
        ...file._doc,
        createdBy: user.bind(this, file.createdBy),
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user,
      createFiles: files.bind(this, user.createFiles),
    };
  } catch (err) {
    throw err;
  }
};

const transformFile = (file) => {
  return {
    ...file,
    createdBy: user.bind(this, file.createdBy),
  };
};

module.exports = {
  transformFile,
};
