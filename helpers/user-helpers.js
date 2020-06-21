const transformUser = (user) => {
  return {
    ...user,
    password: null,
  };
};

module.exports = {
  transformUser,
};
