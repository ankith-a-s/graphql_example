const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let file = new Schema(
  {
    fileName: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    collection: 'file',
  }
);

module.exports = mongoose.model('file', file);
