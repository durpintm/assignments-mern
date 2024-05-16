const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Admin, Course } = require("../db");
// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  // Check if a admin with this username already exists or not
  Admin.create({
    username: username,
    password: password,
  });

  res.json({
    message: "Admin created successfully!",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic

  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.find({
    username,
    password,
  });

  if (admin) {
    const token = jwt.sign({ username }, JWT_SECRET);

    res.json({
      token: token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect username or password",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });

  res.json({
    message: "Course created successfully!",
    courseId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const allCourses = await Course.find({});

  res.json({ courses: allCourses });
});

module.exports = router;
