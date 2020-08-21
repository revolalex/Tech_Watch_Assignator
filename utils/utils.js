const fetch = require("node-fetch");


/*---------------------------------------------------------
------------------------- FUNCTION PART -------------------
---------------------------------------------------------*/
class Utils {


  /*---------------------------------------------------------
------------------------- API PART -------------------
---------------------------------------------------------*/
  /**
   * @summary catch the "Student "to add and push him into an array, then insert him into the collection Students
   * @param {*} dataBase
   * @param {*} req
   * @returns the student to add (input)
   */
  static addToStudentsCollection = async (dataBase, req) => {
    let studentToAdd = req.body;
    try {
      await dataBase.collection("StudentsList").insertOne(studentToAdd);
    } catch (error) {
      console.log(error);
    }
    return studentToAdd;
  };

  /**
   * @summary delete in the Student collection the student name input
   * @param {*} dataBase
   * @param {*} req
   * @returns the student name to delete
   */
  static deleteStudentsToCollection = async (dataBase, req) => {
    let studentName = req.body.nameToDelete;
    // console.log(studentName);
    try {
      await dataBase
        .collection("StudentsList")
        .deleteOne({ name: studentName });
    } catch (error) {
      console.log(error);
    }
    return studentName;
  };

  /**
   * @summary read the Students collection and assign the content to nameOfStudent
   * @returns an array of students stock in the collection Students (nameOfStudent)
   * @param {*} dataBase
   */
  static showStudent = async (dataBase) => {
    const nameOfStudent = await dataBase
      .collection("StudentsList")
      .find()
      .toArray();
    return nameOfStudent;
  };

  /**
   * @summary read the Groups collection and assign  the content to nameOfGroup
   * @param {*} dataBase
   * @returns an array of groups stock in the collection Groups (nameOfGroup)
   */
  static showGroup = async (dataBase) => {
    const nameOfGroup = await dataBase.collection("Groups").find().toArray();
    return nameOfGroup;
  };

  /**
   * @summary add in the collection Groups a new group
   * @returns the name of the group we want to add
   * @param {*} dataBase
   * @param {*} req
   */
  static addToGroupsCollection = async (dataBase, req) => {
    let myObject = {
      groupsToAdd: req.body.tech,
      date: req.body.date,
      number: req.body.number,
      names: req.body.names,
    };
    try {
      await dataBase.collection("Groups").insertOne(myObject);
    } catch (error) {
      console.log(error);
    }
    return myObject;
  };

 /*--------------------------------------------------------
------------------------- MAIN PART ----------------------
---------------------------------------------------------*/
  /**
   * @returns object containing two array of date (old and new)
   */
  static sortDates = async function () {
    
    let techData = await fetch("http://localhost:8080/TechWatch");
    let allTech = await techData.json();
    //---SORT DATES
    let tabOfDates = [];
    let oldTab = [];
    let newTab = [];
    const todayDate = new Date();
    
      for (let i = 0; i < allTech.length; i++) {
        let date = new Date(allTech[i].date);
        tabOfDates.push({ date: date, index: i });
      }
  
      tabOfDates.sort((a, b) => {
        return a.date - b.date;
      });
  
      for (let i = 0; i < tabOfDates.length; i++) {
        if (todayDate > tabOfDates[i].date) {
          oldTab.push(allTech[tabOfDates[i].index])
        } else  {
          newTab.push(allTech[tabOfDates[i].index]);
        }
      }
          let obj = {
            oldTab: oldTab,
            newTab: newTab,
          };
          return obj;
  };




  /**
   * @return a list of student available
   */
  static changedList = async function () {
    let newListGroup = [];
    let newListStudents = [];
    let techData = await fetch("http://localhost:8080/TechWatch");
    let allTech = await techData.json();
    const list = await fetch("http://localhost:8080/StudentsList");
    const studentList = await list.json();

    allTech.forEach((e) => {
      e.names.forEach((el) => {
        newListGroup.push(el);
      });
    });
    studentList.forEach((e) => {
      newListStudents.push(e.name);
    });
    let finalList = newListStudents.filter((e) => !newListGroup.includes(e));
    return finalList;
  };

  static postStudent = function (req) {
    fetch("http://localhost:8080/StudentsList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: req.body.name,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(async function (sucess) {
        console.log("This student be add to the collection: ", sucess.name);
      })
      .catch(function (error) {
        console.log("Request failure: ", error);
      });
  };

  static deleteStudent = function (req) {
    fetch("http://localhost:8080/StudentsList", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nameToDelete: req.body.nameToDelete,
      }),
    })
      .then(function (response) {
        return response.text();
      })
      .then(async function (sucess) {
        console.log("This student be deleted of the collection: ", sucess.name);
      })
      .catch(function (error) {
        console.log("Request failure: ", error);
      });
  };

  static postTechWatch = async function (req) {
    const num = req.body.number;
    const studentListFree = await this.changedList();
    let names = [];
    for (let i = 0; i < num; i++) {
      let random = Math.floor(Math.random() * studentListFree.length);
      names.push(studentListFree[random]);
      studentListFree.splice(random, 1);
    }

    await fetch("http://localhost:8080/TechWatch", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tech: req.body.tech,
        date: req.body.date,
        number: req.body.number,
        names: names,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(async function (sucess) {
        console.log(`This Tech be add to the collection` + " : "+  req.body.tech);
      })
      .catch(function (error) {
        console.log("Request failure: ", error);
      });
  };
}

module.exports = Utils;
