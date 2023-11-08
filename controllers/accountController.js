const Account = require('../models/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const sendEmail = require('../utils/mailer');
const crypto = require('crypto');


const generateAuthToken = async (user) => {
  return jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
};

const register = async (req, res) => {
  try {
    const existingAccount = await Account.findOne({ username: req.body.username });
    if (existingAccount) {
      return res.status(409).send({ error: 'Username already exist with another account.' });
    }

    const defaultRole = await Role.findOne({ name: 'guest' });
    if (!defaultRole) {
      throw new Error('Default role not found.');
    }

    const account = new Account({
      ...req.body,
      roleId: defaultRole._id,
    });

    const token = await generateAuthToken(account);
    account.tokens = token;
    await account.save();
    res.status(201).send({ account });
  } catch (error) {
    console.error('Error during password reset request:', error.stack);
    res.status(500).send({ error: 'There was an error processing your request.' });
  }
};


const login = async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    const account = await Account.findByCredentials(username, password);
    if (!account) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    res.send({ account });
  } catch (error) {
    res.status(400).send(error);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const resetToken = account.createPasswordResetToken();
    await account.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/accounts/resetPassword/${resetToken}`;
    await sendEmail(account._id, 'Password Reset', `Please reset your password by clicking the following link: ${resetURL}`);


    res.status(200).send({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).send({ error: 'There was an error processing your request.' });
  }
};

const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const account = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!account) {
    return res.status(400).send({ error: 'Token is invalid or has expired.' });
  }

  account.password = req.body.password;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();

  res.status(200).send({ message: 'Your password has been reset.' });
};

const getProfile = async (req, res) => {
  try {
    await req.account.populate({ path: 'roleId', select: 'name -_id' });

    const accountData = req.account.toObject();

    const responseData = {
      accountid: accountData._id,
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      dateOfBirth: accountData.dateOfBirth,
      username: accountData.username,
      roleName: accountData.roleId ? accountData.roleId.name : undefined
    };

    res.send(responseData);
  } catch (error) {
    console.error('Failed to get profile:', error);
    res.status(500).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.account[update] = req.body[update]);
    if (req.body.password) {
      req.account.password = await bcrypt.hash(req.body.password, 8);
    }
    await req.account.save();
    res.send(req.account);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({})
      .populate('roleId', 'name -_id')
      .select('_id firstName lastName dateOfBirth username tokens');

    const formattedAccounts = accounts.map(account => {
      const accountObj = account.toObject();
      return {
        accountId: accountObj._id,
        firstName: accountObj.firstName,
        lastName: accountObj.lastName,
        dateOfBirth: accountObj.dateOfBirth,
        username: accountObj.username,
        tokens: accountObj.tokens,
        roleName: accountObj.roleId ? accountObj.roleId.name : undefined, // Đổi roleID thành roleName cho dễ nhìn
      };
    });

    res.status(200).send(formattedAccounts);
  } catch (error) {
    console.error('Failed to get accounts:', error);
    res.status(500).send(error.message || 'Server Error');
  }
};


const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);

    if (!account) {
      return res.status(404).send({ error: 'Account not found.' });
    }

    res.send({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getAllAccounts,
  deleteAccount,
  requestPasswordReset,
  resetPassword
};


