// import helper class containing all functions CRUD (Create(post) Read(get) Update(put) Delete)
const Utils = require("./utils/utils.js");

const MongoCLient = require("mongodb").MongoClient;
const express = require("express");
const bodyParser = require("body-parser"); // use to parse the body in Json Format
const colors = require("colors")
const url = "mongodb://localhost:27017";
const app = express();

const main = async () => {
  /* MONGO conection and DataBase création*/
  const client = await MongoCLient.connect(url, { useUnifiedTopology: true });
  const dataBase = client.db("tech-watch-assignator");

  try {
    /* ROUTES */
    app.listen(8080);

    // middlewear allows  us to support different format
    app.use(bodyParser.json()); // use by req.body property (to have key value)
    app.use(express.urlencoded({ extended: true })); // allow us to read thebody

    /* Accueil */
    app.get("/home", function (req, res) {
      res.status(200).send("Vous êtes à laccueil");
    });
    console.log("http://localhost:8080/home");

    /*---------------------------------------------------------
    ------------------------- STUDENTS PART -------------------
    ---------------------------------------------------------*/

    /* Students */
    app.get("/StudentsList", async function (req, res) {
      res.status(200).send(await Utils.showStudent(dataBase));
    });

    console.log("http://localhost:8080/StudentsList");

    /* Students POST - Add a student */
    app.post("/StudentsList", async function (req, res) {
      res.status(200).send(await Utils.addToStudentsCollection(dataBase, req));
    });

    /* Students Delete */
    app.delete("/StudentsList", async function (req, res) {
      res.status(200).send(await Utils.deleteStudentsToCollection(dataBase, req));
    });

    /*---------------------------------------------------------
    ------------------------- GROUPS PART ---------------------
    ---------------------------------------------------------*/

    /* Groups */
    app.get("/TechWatch", async function (req, res) {
      res.status(200).send(await Utils.showGroup(dataBase));
    });
    console.log("http://localhost:8080/TechWatch");

    /* Groups Post */
    app.post("/TechWatch", async function (req, res) {
      res.status(200).send(await Utils.addToGroupsCollection(dataBase, req));
    });


  } catch (error) {
    console.log(error);
  } finally {
    console.log("!==> Success <==! all is good".magenta);
  }
};
main();

