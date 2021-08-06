const mongoose = require("mongoose");
var SocietySc = new mongoose.Schema({
  society: { type: Array },
});
const society = mongoose.model("society", SocietySc);
module.exports = society;
