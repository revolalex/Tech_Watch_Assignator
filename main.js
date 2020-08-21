// import helper class containing all functions CRUD (Create(post) Read(get) Update(put) Delete)
const Utils = require("./utils/utils.js");
const moment = require("moment")
const fetch = require("node-fetch");
const request = require("request");
const express = require("express"); //Imports the express module
const app = express(); //Creates an instance of the express module
const ejs = require("ejs");
const PORT = 3000;

// Allow us to have dates in english
moment.locale('en')
/*---------------------------------------------------------
------------------------- MIDDLEWARE ----------------------
---------------------------------------------------------*/

app.use(express.urlencoded({ extended: true })); // allow us to receive data from formulaire
app.use(express.json()); // allow us to work with json format
app.set("view engine", "ejs"); // the view engine in type of ejs
app.use(express.static("public")); // mention the public directory from which you are serving the static files. Like css/js/image


/*---------------------------------------------------------
------------------------- ROUTE ---------------------------
---------------------------------------------------------*/

// HOME
app.get("/", async function (req, res) {
  obj = await Utils.sortDates();
  list = await Utils.changedList();
  res.render("home.ejs", { newTab: obj.newTab, list: list, moment: moment });
});

// ABOUT
app.get("/about", function (req, res) {
  res.render("about.ejs");
});

/*---------------------------------------------------------
------------------------- STUDENT PART --------------------
---------------------------------------------------------*/

// ADD STUDENT LIST
var allStudents = [];
app.get("/StudentsList", async function (req, res) {
  let studentData = await fetch("http://localhost:8080/StudentsList");
  allStudents = await studentData.json();
 
  res.render("StudentsList.ejs", { studentArray: allStudents });
});

// POST STUDENT
app.post("/StudentsList", async function (req, res) {
  await Utils.postStudent(req);
  res.redirect("StudentsList");
});

// DELETE A STUDENT
app.post("/StudentsListDelete", async (req, res) => {
    await Utils.deleteStudent(req)
  res.redirect("StudentsList");
});

/*---------------------------------------------------------
------------------------- TECH WATCH ----------------------
---------------------------------------------------------*/

//TECH WATCH
app.get("/TechWatch", async function (req, res) {
  let obj = await Utils.sortDates();
  changedList = await Utils.changedList();
  res.render("tech_watch", { newTab: obj.newTab , listOfStudentFree: changedList, moment: moment});
});

// POST TECH WATCH (GROUP)
app.post("/TechWatch", async function (req, res) {
  await Utils.postTechWatch(req)
  res.redirect("TechWatch");
});

//GET HISTORY TECH
app.get("/History", async function (req, res) {
  let obj = await Utils.sortDates();
  await res.render("history", { newTab: obj.newTab, oldTab: obj.oldTab, moment: moment });
});

//Starts the Express server with a callback
app.listen(PORT, function (err) {
  if (!err) {
    console.log("http://localhost:3000/");
    console.log("http://localhost:3000/StudentsList");
    console.log("http://localhost:3000/TechWatch");
    console.log("http://localhost:3000/History");
    console.log("http://localhost:3000/About");
  } else {
    console.log(JSON.stringify(err));
  }
});

