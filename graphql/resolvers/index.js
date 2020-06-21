const authResolvers = require('./auth');
const fileResolvers = require('./file')

const rootValue = {
  ...authResolvers,
  ...fileResolvers,
};

module.exports = rootValue;
