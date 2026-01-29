const express = require("express");
const router = express.Router();

// GET /api/student endpoint
// Returns student name and student ID as JSON
router.get("/", (req, res) => {
  res.json({
    name: "Anushi Amarasinghe", 
    studentId: "s224727365" 
  });
});

module.exports = router;
