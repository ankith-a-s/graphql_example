const { postRequestByUrl } = require('../../helpers/request-helpers');
const { transformUser } = require('../../helpers/user-helpers');

module.exports = {
  registerUserByEmailAndPassword: async ({
    userInput: { email, password },
  }) => {
    const userData = await postRequestByUrl('register-email-password', {
      email: email,
      password: password,
    });
    return transformUser(userData);
  },
  loginByEmailAndPassword: async ({ userInput: { email, password } }) => {
    const { token, user } = await postRequestByUrl('login-by-email-password', {
      email: email,
      password: password,
    });
    return {
      token: token,
      user: transformUser(user),
    };
  },
  changePassword: async ({ userInput: { email, password } }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized request');
    const updatedUser = await postRequestByUrl(
      'change-password',
      {
        email: email,
        password: password,
      },
      req.headers['authorizationtoken']
    );
    return transformUser(updatedUser);
  },
  generateResetPasswordLink: async ({ emailInput: { email } }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized request');
    const { token, user } = await postRequestByUrl(
      'generate-reset-password-link',
      {
        email: email,
      },
      req.headers['authorizationtoken']
    );
    return {
      token: token,
      user: transformUser(user),
    };
  },
  verifyResetPasswordToken: async (
    { emailTokenInput: { email, token } },
    req
  ) => {
    if (!req.isAuth) throw new Error('Unauthorized request');
    const updatedUser = await postRequestByUrl(
      'verify-reset-password-token',
      {
        email: email,
        token: token,
      },
      req.headers['authorizationtoken']
    );
    return transformUser(updatedUser);
  },
};
