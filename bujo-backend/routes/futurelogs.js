const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const FutureLogs = require("../models/FutureLogs");
const { body, validationResult } = require("express-validator");
//ROUTE 1: to create new future log. /api/futurelog/createfuturelog
router.post(
  "/createfuturelog",
  [body("log_type", "Please choose valid duration for future log").isEmpty()],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    console.log("Body", req.body);
    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    // const { log_type } = req.body;
    console.log(req.body);
    let { log_type, tasks } = req.body;
    let getFutureLog = await FutureLogs.findOne({
      $and: [{ log_type: log_type, userID: res.user.id }],
    });
    if (getFutureLog) {
      return res.status(401).send({ error: "Future log is already exist" });
    }

    let year = new Date().getFullYear();
    let duration = [];
    switch (log_type) {
      case "Quarter-1":
        duration = ["JAN", "FEB", "MAR"];
        break;
      case "Quarter-2":
        duration = ["APR", "MAY", "JUN"];
        break;
      case "Quarter-3":
        duration = ["JUL", "AUG", "SEP"];
        break;
      case "Quarter-4":
        duration = ["OCT", "NOV", "DEC"];
        break;
      case "First-Half":
        duration = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
        break;
      case "Second-Half":
        duration = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        break;
      case "Current Year":
        duration = [year];
        break;
      case "Next 3 Years":
        duration = [parseInt(year), parseInt(year) + 1, parseInt(year) + 2];
        break;
      case "Next 5 Years":
        duration = [
          parseInt(year),
          parseInt(year) + 1,
          parseInt(year) + 2,
          parseInt(year) + 3,
          parseInt(year) + 4,
        ];
        break;
      case "Next 10 Years":
        duration = [
          parseInt(year),
          parseInt(year) + 1,
          parseInt(year) + 2,
          parseInt(year) + 3,
          parseInt(year) + 4,
          parseInt(year) + 5,
          parseInt(year) + 6,
          parseInt(year) + 7,
          parseInt(year) + 8,
          parseInt(year) + 9,
        ];
        break;

      default:
        break;
    }
    let updated_tasks = [];
    tasks.forEach(task => {
      updated_tasks.push({task,done:false})
      
    });
    console.log(duration);
    try {
      const newFutureLog = await FutureLogs.create({
        log_type: log_type,
        userID: res.user.id,
        tasks: updated_tasks,
        duration: duration,
      });
      console.log(
        "New note is created succesfully by user",
        res.user.id,
        newFutureLog
      );
      res.status(200).send({
        result: "New Future log  added successfully",
        futurelogs: newFutureLog,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 2: to get all collection from user. /api/futurelog/getallnotes
router.get("/getfuturelog/:id", fetchuser, async (req, res) => {
  try {
    ////consolelog("x", res.user.id);
    let items = await Collections.findById(req.params.id);
    ////consolelog(listOfNotes);
    res.status(200).send({ notes: listOfNotes });
  } catch (err) {
    ////consolelog(err.message);
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 2: to add item to futurelog. /api/futurelogs/additemtolog
router.put("/additemtolog/:id", fetchuser, async (req, res) => {
  try {
    let futurelog = await FutureLogs.findById(req.params.id);
    //consolelog("collection", collection);

    let task = req.body.task;
    console.log("task", task);
    let indexOfitem = futurelog.tasks.indexOf(task);
    console.log("indexOfitem", indexOfitem);
    if (indexOfitem !== -1) {
      return res
        .status(401)
        .send({ error: "Item already added to collection" });
    }
    if (task) {
      futurelog.tasks.push(task);
    }
    if (futurelog.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    futurelog = await FutureLogs.findByIdAndUpdate(req.params.id, {
      $set: futurelog,
    });

    res.status(200).send({ "updated Future Log": futurelog });
  } catch (err) {
    console.log(err.message);
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 3: to update existing note. /api/futurelog
// router.put(
//   "/updatenote/:id",
//   [
//     body("title", "Please provide valid title for note").isLength({ min: 3 }),
//     body("description", "Please provide some description for note").isLength({
//       min: 3,
//     }),
//   ],
//   fetchuser,
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty) {
//       res.status(500).send({ errors: errors.array() });
//     }
//     const { title, description, tag } = req.body;
//     let updatedNote = {};
//     if (title) {
//       updatedNote.title = title;
//     }
//     if (description) {
//       updatedNote.description = description;
//     }
//     if (tag) {
//       updatedNote.tag = tag;
//     }

//     //Find by id
//     let exitingNote = await Notes.findById(req.params.id);
//     ////consolelog("existingNote", exitingNote, req.params.id);
//     if (!exitingNote) {
//       return res
//         .status(404)
//         .send({ error: "Note with given title is not exist" });
//     }

//     if (exitingNote.userID.toString() !== res.user.id) {
//       return res.status(401).send({ error: "Unauthorized access" });
//     }

//     exitingNote = await Notes.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedNote },
//       { new: true }
//     );
//     res.send(exitingNote);
//   }
// );

//ROUTE 4: to delete item from collection. /api/futurelog/deleteitem
router.put("/deleteitem/:id/:index", fetchuser, async (req, res) => {
  //   let deleteItem = await Collections.findById(req.params.id);
  let collection = await Collections.findById(req.params.id);
  let itemToRemove = collection.collection_items[req.params.index];
  if (itemToRemove) {
    collection.collection_items = collection.collection_items.filter(
      (index, item) => index !== req.params.index
    );
    //consolelog("collection.collection_items", collection.collection_items);
  }
  collection = await Collections.findByIdAndUpdate(req.params.id, {
    $set: collection,
  });
  res.send(collection);
  if (!collection) {
    return res
      .status(404)
      .send({ error: `Item removed from collection${collection.collection}` });
  }
  //   if (deleteNote.userID.toString() !== res.user.id) {
  //     return res.status(401).send({ error: "Unauthorized access" });
  //   }

  //   deleteNote = await Notes.findByIdAndDelete(req.params.id);
  //   if (!deleteNote) {
  //     return res.status(401).send({ error: "Note can not be deleted" });
  //   } else {
  //     return res.status(200).send({ success: "Note deleted successfully" });
  //   }
});

//ROUTE 4: to delete  collection. /api/futurelog/deletefuturelog
router.delete("/deletefuturelog/:id/", fetchuser, async (req, res) => {
  //   let deleteItem = await Collections.findById(req.params.id);

  try {
    let futurelog = await FutureLogs.findById(req.params.id);

    if (futurelog.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    futurelog = await FutureLogs.findByIdAndDelete(req.params.id);
    if (!futurelog) {
      return res.status(401).send({ error: "Future Log can not be deleted" });
    } else {
      return res
        .status(200)
        .send({ success: "Future Log deleted successfully" });
    }
  } catch (error) {
    console.log(err.message);
    res.status(400).send("Internal Server Error");
  }
});

module.exports = router;
