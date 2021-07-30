const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/views/`));
var conn = mongoose.connection;

const PORT = 3000 || process.env.PORT;
const student = require("./model/schema");
mongoose
  .connect("mongodb://localhost:27017/students-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });
app.get("/", (req, res) => {
  student.find((err, data) => {
    res.render("index", { data: data });
  });
});
app.get("/create", (req, res) => {
  res.render("makerecords");
});
app.get("/deleteall", (req, res) => {
  res.redirect("/create");
});
app.get("/edit", (req, res) => {
  res.render("edit");
});
app.get("/delete", (req, res) => {
  res.render("delete");
});
app.post("/delete", (req, res) => {
  console.log(req.body.name);
  conn.collection("students").deleteOne({ name: req.body.name });
  res.redirect("/");
});
app.post("/addrecord", (req, res) => {
  var studentmodel = new student();
  str_sub = req.body.subjects;
  subjects_arr = str_sub.split(",");
  str_soc = req.body.society;
  society_arr = str_soc.split(",");
  console.log(typeof req.body.subjects);
  studentmodel.name = req.body.name;
  studentmodel.contact = req.body.contact;
  studentmodel.subjects = subjects_arr;
  studentmodel.class = req.body.class;
  studentmodel.society = society_arr;
  studentmodel.year = req.body.year;
  try {
    conn.collection("students").insertOne(studentmodel);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});
app.post("/editrecord", (req, res) => {
  var name = { name: req.body.name };
  ElementToChange = req.body.modify;
  conn
    .collection("students")
    .findOneAndUpdate(
      name,
      { $set: { [ElementToChange]: req.body.change } },
      { upsert: true }
    );
  res.redirect("/");
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
/*var studentmodel = new student();
studentmodel.name = "shahzad";
studentmodel.contact = "1234";
var conn = mongoose.connection;
conn.collection("students").insertOne(studentmodel);
student.find((err, data) => {
  console.log(data);
});
 */
