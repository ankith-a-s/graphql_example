const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) {
            return true;
          }
          return /^([\w-\.\+W]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props) => `${props.value} is not a valid Email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_expires: {
      type: Date,
    },
    createFiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

schema.set('collection', 'users');
module.exports = mongoose.model('user', schema);
