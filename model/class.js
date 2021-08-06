const mongoose = require("mongoose");
var ClassSc = new mongoose.Schema({
  class: { type: Array, required: "required" },
  Societies: { type: mongoose.Types.ObjectId, ref: "society" },
});
const classM = mongoose.model("class", ClassSc);
module.exports = classM;
