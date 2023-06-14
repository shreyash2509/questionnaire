const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  answers: [String],
  correctAnswers: [String],
});

module.exports = mongoose.model("Question", questionSchema);
