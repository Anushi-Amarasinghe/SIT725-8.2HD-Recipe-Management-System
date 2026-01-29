const express = require("express");
const router = express.Router();

// GET /api/student endpoint
// Returns student name and student ID as JSON
router.get("/", (req, res) => {
  res.json({
    name: "Anushi Amarasinghe", // TODO: Replace with your actual name
    studentId: "s224727365" // TODO: Replace with your actual student ID
  });
});

module.exports = router;
