const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

// MiddleWare
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Mongoose.connect("mongodb://localhost:27017/tech-watch-assignator", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const StudentModel = Mongoose.model("studentslist", {
  name: String,
});

const GroupModel = Mongoose.model("groups", {
  groupsToAdd: String,
  date: String,
  number: String,
  names: [String],
});

/*---------------------------------------------------------
------------------------- HOME PART -----------------------
---------------------------------------------------------*/
 /* Accueil */
 app.get("/home", async (request, response) => {
  res.status(200).send("Vous êtes à laccueil");
});

/*---------------------------------------------------------
------------------------- STUDENTS PART -------------------
---------------------------------------------------------*/
app.post("/StudentsList", async (request, response) => {
  try {
    var student = new StudentModel(request.body);
    var result = await student.save();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/StudentsList", async (request, response) => {
  try {
    const result = await StudentModel.find().exec();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/StudentsList", async (request, response) => {
  try {
    const result = await StudentModel.deleteOne({
      name: request.body.nameToDelete,
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

/*---------------------------------------------------------
------------------------- TECHWATCH PART -------------------
---------------------------------------------------------*/
app.get("/TechWatch", async (request, response) => {
  try {
    const result = await GroupModel.find();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/TechWatch", async (request, response) => {
  let myObject = {
    groupsToAdd: request.body.tech,
    date: request.body.date,
    number: request.body.number,
    names: request.body.names
  };
  try {
    const group = new GroupModel(myObject);
    await group.save();
    response.send(group);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.listen(8080, () => {
  console.log("http://localhost:8080/");
  console.log("!==> Success <==! all is good");
});
