const bcrypt = require("bcrypt");
const User = require("../models/user");
const axios = require("axios");
const Test = require("../models/test");
const Question = require("../models/question");
const UserResponse = require("../models/userResponse");

// welcome

const getWelcome = (req, res) => {
  console.log(`status:200,
 success: true,
 message: 'API successfully called',`);
  res.redirect("/welcome");
};

// signup controller

const signup = async (req, res) => {
  try {
    const { name, email, password, phone_number } = req.body;
const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists. Please choose a different email.",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); //here we hash password

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone_number,
    });
    await user.save();
    req.session.isAuthenticated = true;
    console.log(user);
    req.session.username = req.body.name;
    res.redirect("/login");
    console.log(`
    success: true,
    message: 'Signed up successfully'
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during signup",
    });
  }
};

// login controller

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let message = " ";

    const recievedd = await axios.get("https://api.catboys.com/catboy");
    message = recievedd.data.response;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    req.session.isAuthenticated = true;
    req.session.username = user.name;
    req.session.userId = user._id;

    res.redirect("/homepage");
    console.log(`success: true,
    message: ${message}`); //printing the message recieved from the api
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

// logout controller

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }
    res.redirect("/login");
  });
};

//edit phone number

const editPhoneNumber = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { phone_number } = req.body;
    await User.findByIdAndUpdate(userId, { phone_number }); // Update the user's phone number
    res.status(200).json({ message: "Phone number updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//***************************************************************************************************************************** */

//homepage where all tests will be shown

const homepage = async (req, res) => {
  const username = req.session.username;

  try {
    const tests = await Test.find(); // Retrieve all tests from the database

    res.render("homepage", { username, tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller method to render questions for a specific test

const getQuestionsForTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.session.userId;
    const test = await Test.findById(testId); // Find the test by its ID
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }
    const questions = await Question.find({ testId }); // Find all questions associated with the test
    const existingResponse = await UserResponse.findOne({ userId, testId });
    const hasSubmitted = existingResponse !== null;
    res.render("questions", { test, questions, hasSubmitted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//submit controller

const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const userId = req.session.userId;
    const existingResponse = await UserResponse.findOne({ userId, testId }); // Check if the user has already submitted the test
    if (existingResponse) {
      return res.redirect("/homepage");
    }
    const questions = await Question.find({ testId }); // Fetch the questions for the given testId
    let score = 0;
    const userResponses = [];
    questions.forEach((question) => {
      const selectedAnswer = answers[question._id.toString()];
      if (selectedAnswer && question.correctAnswers.includes(selectedAnswer)) {
        score++;
      }
      // Save user's response for the question
      const userResponse = {
        userId,
        testId,
        questionId: question._id,
        selectedAnswers: [selectedAnswer],
        score,
      };
      userResponses.push(userResponse);
    });
    await UserResponse.insertMany(userResponses); // Save the user's responses to the database
    res.redirect("/homepage");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//profile

const getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Retrieve user information
    const user = await User.findById(userId);

    // Retrieve user's test history and scores
    const userResponses = await UserResponse.find({ userId })
      .populate("testId")
      .select("testId score");

    res.render("profile", { user, userResponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  submitTest,
  editPhoneNumber,
  login,
  signup,
  getWelcome,
  logout,
  homepage,
  getQuestionsForTest,
  getProfile,
};
