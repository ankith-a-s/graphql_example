const Users = require('../models/user');
const UserController = require('../controllers/user');
const bcrypt = require('bcrypt');
const logger = require('../lib/utils/logger');
const config = require('config');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');

async function verifyResetPasswordToken({ user, token }) {
  const now = moment();
  if (
    bcrypt.compareSync(token, user.reset_password_token) &&
    now.isBefore(user.reset_password_expires)
  ) {
    return { ...user._doc, _id: user.id };
  }
  return false;
}

async function _verifyResetPasswordToken(req, res) {
  try {
    const { token, email } = req.body;
    const user = await UserController.findUserByEmail(email);
    const data = await verifyResetPasswordToken({ user, token });
    if (!data) {
      throw new Error('invalid token');
    }

    return res.status(200).json({
      success: true,
      statusCode: 'VERIFY_RESET_PASSWORD_TOKEN_SUCCESS',
      message: 'Reset passsword token verified successfully',
      data: data,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      statusCode: 'VERIFY_RESET_PASSWORD_TOKEN_FAILED',
      message: err.message,
    });
  }
}

async function generateResetPasswordLink({ user }) {
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');
  const hash = bcrypt.hashSync(resetPasswordToken, 10);
  const expiryDate = moment().add(config.resetPasswordTokenExpiry, 'seconds');
  const userData = {
    reset_password_token: hash,
    reset_password_expires: expiryDate,
  };
  const updatedUser = await UserController.updateUserByUserId({
    userData: userData,
    userId: user._id,
    user: user,
  });

  return { token: resetPasswordToken, user: updatedUser };
}

async function _generateResetPasswordLink(req, res) {
  try {
    const email_id = req.body.email;
    const user = await UserController.findUserByEmail(email_id);

    if (!user) {
      return res.status(400).json({
        success: false,
        statusCode: 'User is not present',
        message: 'Invalid Email',
      });
    }
    const data = await generateResetPasswordLink({ user: user });
    return res.status(200).json({
      success: true,
      statusCode: 'GENERATE_RESET_PASSWORD_LINK_SUCCESS',
      message: 'User authenticated successfully',
      data: data,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      statusCode: 'GENERATE_RESET_PASSWORD_LINK_FAILED',
      message: err.message,
    });
  }
}

async function getToken(user) {
  const token = jwt.sign(user, config.get('jwt.secret'), {
    expiresIn: config.get('jwt.expiresIn'),
  });

  return token;
}

async function verifyPassword(email, password) {
  const user = await UserController.findUserByEmail(email);

  // bcrypt is a one-way hashing algorithm that allows us to
  // store strings on the database rather than the raw
  // passwords. Check out the docs for more detail
  if (bcrypt.compareSync(password, user.password)) {
    const token = await getToken(user.toJSON());
    return { user, token };
  }

  throw new Error('invalid password');
}

async function _loginByEmailAndPassword(req, res) {
  const { email, password } = req.body;
  // if the email / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      statusCode: 'User Login Failed',
      message: 'Missing email or passoword param',
    });
  }
  try {
    let { user, token } = await verifyPassword(email, password);
    return res.status(200).json({
      success: true,
      statusCode: 'USER_AUTHENTICATED',
      message: 'User authenticated successfully',
      data: {
        token: token,
        user: user,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      statusCode: 'User Login Failed',
      message: 'Invalid Email or Password',
    });
  }
}

async function _registerByEmailAndPassword(req, res) {
  try {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    // first check is
    // create a new user with the password hash from bcrypt
    const userData = {
      email: email,
      password: hash,
    };
    let existingUser = await UserController.findUserByEmail(email);
    if (existingUser) {
      return res.status(401).json({
        success: false,
        statusCode: 'User Registration Failed',
        message: 'Email Id already exists',
      });
    }
    let user = await UserController.createUser(userData);
    return res.status(200).json({
      success: true,
      statusCode: 'USER_AUTHENTICATED',
      message: 'User Registration successfull',
      data: user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      statusCode: 'User Registration Failed',
      message: 'User registration failed',
    });
  }
}

async function _changePassword(req, res) {
  try {
    const { password, email } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const user = await UserController.findUserByEmail(email);
    const userData = {
      password: hash,
      reset_password_token: null,
      reset_password_expires: null,
    };
    const updatedUser = await UserController.updateUserByUserId({
      userData: userData,
      userId: user._id,
      user: user,
    });
    return res.status(200).json({
      success: true,
      statusCode: 'CHANGE_PASSWORD_SUCCESS',
      message: 'Reset passsword successfull',
      data: updatedUser,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      statusCode: 'CHANGE_PASSWORD_FAILED',
      message: err.message,
    });
  }
}

async function verifyToken(token) {
  return jwt.verify(token, config.get('jwt.secret'));
}

async function _preAuth(req, res, next) {
  if (
    req.path === `/${config.get('api.version')}/register-email-password` ||
    req.path === `/${config.get('api.version')}/login-by-email-password`
  ) {
    req.isAuth = false
    return next();
  }

  const token = req.headers['authorizationtoken'];

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 'NO_AUTH_TOKEN',
      message: 'No auth token is provided',
      data: {},
    });
  }

  try {
    let user = await verifyToken(token);

    let existingUser = await UserController.findUserByEmail(user.email);

    if (!existingUser || existingUser.deleted) {
      return res.status(403).json({
        success: false,
        statusCode: 'NOT_AUTHORIZED',
        message: 'You are not authorized. Please contact the administrator.',
        data: {},
      });
    }

    req.user = existingUser;
    req.isAuth = true

    next();
  } catch (error) {
    req.isAuth = false
    logger.error({
      description: 'Error in preauthentication',
      error,
      user: req.user,
    });

    return res.status(401).json({
      success: false,
      statusCode: 'AUTH_TOKEN_INVALID',
      message: 'Auth Token is Invalid',
      data: {},
    });
  }
}

async function _fakeAuth(req, res, next) {
  let user = await UserController.findUserByEmail('admin@dhiyo.com');
  req.user = user;
  req.isAuth = true
  next();
}

module.exports = {
  _changePassword,
  _generateResetPasswordLink,
  _loginByEmailAndPassword,
  _registerByEmailAndPassword,
  _verifyResetPasswordToken,
  _preAuth,
  _fakeAuth,
};
