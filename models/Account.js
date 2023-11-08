const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
    //029: guest
    //025: admin
  },
  tokens: {
      type: [String],
      required: true,
  }
}, {
  timestamps: true
});

// hash mật khẩu
accountSchema.pre('save', async function (next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 8);
  }
  next();
});

// Xác thực mật khẩu
accountSchema.statics.findByCredentials = async function(username, password) {
  const account = await this.findOne({ username });
  if (!account) {
    throw new Error('Unable to login. User not found.');
  }
  console.log('Stored hash:', account.password);
  console.log('Password being checked:', password);

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new Error('Unable to login. Password incorrect.');
  }
  return account;
};

// Ham password reset
accountSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
     // Token het han trong 10p
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const Account = mongoose.model('Account', accountSchema);

module.exports = Account;