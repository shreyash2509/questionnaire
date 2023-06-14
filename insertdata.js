const mongoose = require('mongoose');
const Test = require('./models/test');
const Question = require('./models/question');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/questionnaire', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');

  // Insert sample data for Tests collection
  // const tests = [
  //   {
  //    //  _id: new mongoose.Types.ObjectId("test1"),
  //     title: "Math Test",
  //     // Other fields specific to the test
  //   },
  //   {
  //    //  _id: new mongoose.Types.ObjectId("test2"),
  //     title: "Science Test",
  //     // Other fields specific to the test
  //   }
  // ];
  // Test.insertMany(tests).then(() => {
  //   console.log('Sample data inserted into Tests collection');
  // }).catch(error => {
  //   console.error('Failed to insert sample data into Tests collection:', error);
  // });

  // Insert sample data for Questions collection
  const questions = [
    {
     //  _id: new mongoose.Types.ObjectId("question1"),
      testId: "6488465751ea3365fd7f117e",
      text: "What is 2 + 2?",
      answers: ["3", "4", "5"],
      correctAnswers: ["4"]
    },
    {
     //  _id: new mongoose.Types.ObjectId("question2"),
      testId: "6488465751ea3365fd7f117e",
      text: "What is the capital of France?",
      answers: ["London", "Paris", "Berlin"],
      correctAnswers: ["Paris"]
    },
    {
     //  _id: new mongoose.Types.ObjectId("question3"),
      testId: "6488465751ea3365fd7f117f",
      text: "Who discovered gravity?",
      answers: ["Albert Einstein", "Isaac Newton", "Nikola Tesla"],
      correctAnswers: ["Isaac Newton"]
    },
    // Add more questions as needed
  ];
  Question.insertMany(questions).then(() => {
    console.log('Sample data inserted into Questions collection');
  }).catch(error => {
    console.error('Failed to insert sample data into Questions collection:', error);
  });

  // Insert sample data for UserResponses collection
  

}).catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});
