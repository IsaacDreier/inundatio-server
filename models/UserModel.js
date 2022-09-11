const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
  isAlphanumeric,
  isMobilePhone,
  isEmail,
  isNumeric,
} = require('validator');

const BenchmarkSchema = new Schema({
  value: {
    type: Number,
    min: [0, 'value cannot be negative'],
    required: true,
  },
  comparison: {
    type: String,
    enum: {
      values: ['greater', 'less'],
      message: '{VALUE} is not a supported comparison',
    },
    required: true,
  },
  shouldAlert: {
    type: Boolean,
    required: true,
    default: false,
  },
  site: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isNumeric(v, 'en-US'),
      message: (p) => `Site "${p}" is not valid`,
    },
    minLength: [8, 'Site "{VALUE}" is not valid'],
    maxLength: [15, 'Site "{VALUE}" is not valid'],
  },
});

const UserSchema = new Schema({
  _id: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return isAlphanumeric(v);
      },
      message: (props) => `${props.value} is not a valid user id`,
    },
  },
  nickname: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isAlphanumeric(v, 'en-US', { ignore: ' -' }),
      message: (props) => 'nickname should be alphanumeric',
    },
    maxLength: [22, 'nickname is too long'],
  },
  benchmarks: [BenchmarkSchema],
  phone: {
    type: String,
    required: false,
    validate: {
      validator: (v) => isMobilePhone(v),
      message: (p) => 'phone number is invalid',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: (p) => 'email is invalid',
    },
  },
  site: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isNumeric(v, 'en-US'),
      message: (p) => `Site "${p}" is not valid`,
    },
    minLength: [8, 'Site "{VALUE}" is not valid'],
    maxLength: [15, 'Site "{VALUE}" is not valid'],
  },
  visits: {
    type: Number,
    default: 0,
    min: [0, 'visits cannot be negative'],
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
