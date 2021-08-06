const mongoose = require("mongoose");
var student_schema = new mongoose.Schema({
  name: {
    type: String,
    required: "required",
    unique: true,
  },
  contact: {
    type: String,
    required: "required",
    unique: true,
  },
  subjects: {
    type: Array,
    required: "required",
  },
  classes: { type: mongoose.Types.ObjectId, ref: "class" },
  year: { type: Date, required: "required" },
});
const student = mongoose.model("students", student_schema);
module.exports = student;
