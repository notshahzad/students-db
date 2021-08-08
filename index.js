const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/views/`));
var conn = mongoose.connection;

const PORT = 3000 || process.env.PORT;
const studentModel = require("./model/student");
const classModel = require("./model/class");
const societyModel = require("./model/society");
mongoose
  .connect("mongodb://localhost:27017/students-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });
app.get("/", (req, res) => {
  studentModel
    .find()
    .populate({
      path: "classes",
      populate: { path: "Societies", model: "society" },
    })
    .then((data) => res.render("index", { data: data }))
    .catch((err) => console.log(err));
});
app.get("/register", (req, res) => {
  res.render("makerecords");
});
app.get("/deleteall", (req, res) => {
  conn.collection("students").deleteMany();
  conn
    .collection("classes")
    .deleteMany()
    .catch((err) => console.log(err));
  conn
    .collection("societies")
    .deleteMany()
    .catch((err) => console.log(err));
  res.redirect("/register");
});
app.get("/edit", (req, res) => {
  res.render("edit");
});
app.get("/delete", (req, res) => {
  res.render("delete");
});
app.get("/json", (req, res) => {
  studentModel
    .find()
    .populate({
      path: "classes",
      populate: { path: "Societies", model: "society" },
    })
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
});
app.post("/delete", (req, res) => {
  console.log(req.body.name);
  studentModel
    .find()
    .populate("classes")
    .then((data) => {
      PopulatedData = data.find((key) => key.name === req.body.name);
      conn.collection("classes").deleteOne({ _id: PopulatedData.classes._id });
      conn
        .collection("societies")
        .deleteOne({ _id: PopulatedData.classes.Societies });
      conn.collection("students").deleteOne({ name: req.body.name });
    });
  res.redirect("/");
});
app.post("/addrecord", (req, res) => {
  str_sub = req.body.subjects;
  subjects_arr = str_sub.split(",");
  str_soc = req.body.society;
  society_arr = str_soc.split(",");
  var StudentModel = new studentModel({
    name: req.body.name,
    contact: req.body.contact,
    year: req.body.year,
    subjects: subjects_arr,
  });
  var ClassModel = new classModel({
    class: req.body.class,
  });
  var SocietyModel = new societyModel({
    society: society_arr,
  });
  ClassModel.Societies = SocietyModel._id;
  StudentModel.classes = ClassModel._id;
  StudentModel.save().catch((err) => console.log(err));
  console.log(StudentModel);
  console.log(ClassModel);
  SocietyModel.save().catch((err) => console.log(err));
  ClassModel.save().catch((err) => console.log(err));
  res.redirect("/");
});
app.post("/editrecord", (req, res) => {
  var name = { name: req.body.name };
  ElementToChange = req.body.modify;
  if (ElementToChange != "class" && ElementToChange != "society") {
    conn
      .collection("students")
      .findOneAndUpdate(
        name,
        { $set: { [ElementToChange]: req.body.change } },
        { upsert: true }
      );
    res.redirect("/");
  } else {
    studentModel
      .find()
      .populate("classes")
      .then((data) => {
        PopulatedData = data.find((key) => key.name === req.body.name);
        if (ElementToChange == "class") {
          conn
            .collection("classes")
            .findOneAndUpdate(
              { _id: PopulatedData.classes._id },
              { $set: { [ElementToChange]: req.body.change } }
            )
            .then(res.redirect("/"))
            .catch((err) => console.log(err));
        } else {
          conn
            .collection("societies")
            .findOneAndUpdate(
              { _id: PopulatedData.classes.Societies },
              { $set: { [ElementToChange]: req.body.change } }
            )
            .then(res.redirect("/"))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
});
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
