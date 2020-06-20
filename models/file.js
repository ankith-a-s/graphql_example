const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define collection and schema
let File = new Schema(
  {
    fileName: {
      type: String
    }
  },
  {
    collection: "file"
  }
);

module.exports = mongoose.model("File", File);
