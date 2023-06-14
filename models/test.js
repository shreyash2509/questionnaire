const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Other fields specific to the test
});

module.exports = mongoose.model("Test", testSchema);
