const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { findById } = require("../models/Notes");
//ROUTE 1: to create new note. /api/createnote
router.post(
  "/createnote",
  [
    body("title", "Please provide valid title for note").isLength({ min: 3 }),
    body("description", "Please provide some description for note").isLength({
      min: 3,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { title, description, tag } = req.body;
    let getNoteBytitle = await Notes.findOne({
      $or: [{ title: req.body.title, userID: res.user.id }],
    });
    if (getNoteBytitle) {
      return res
        .status(401)
        .send({ error: "Note with similar title is already exist" });
    }
    try {
      const newNote = await Notes.create({
        title: title,
        userID: res.user.id,
        description: description,
        tag: tag,
      });
      //console.log("New note is created succesfully by user", res.user.id);
      res
        .status(200)
        .send({ result: "New note added successfully", newNote: newNote });
    } catch (err) {
      //console.log(err.message);
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 2: to get all notes from user. /api/getallnotes
router.get("/getallnotes", fetchuser, async (req, res) => {
  try {
    //console.log("x", res.user.id);
    let listOfNotes = await Notes.find({ userID: res.user.id });
    //console.log(listOfNotes);
    res.status(200).send({ notes: listOfNotes });
  } catch (err) {
    //console.log(err.message);
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 3: to update existing note. /api/updatenote
router.put(
  "/updatenote/:id",
  [
    body("title", "Please provide valid title for note").isLength({ min: 3 }),
    body("description", "Please provide some description for note").isLength({
      min: 3,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { title, description, tag } = req.body;
    let updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    //Find by id
    let exitingNote = await Notes.findById(req.params.id);
    //console.log("existingNote", exitingNote, req.params.id);
    if (!exitingNote) {
      return res
        .status(404)
        .send({ error: "Note with given title is not exist" });
    }

    if (exitingNote.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    exitingNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true }
    );
    res.send(exitingNote);
    //   let getNoteBytitle = await Notes.findOne({$or:[{ title: req.body.title, userID:res.user.id }]});
    //   if (!getNoteBytitle) {
    //     return res
    //       .status(401)
    //       .send({ error: "Note with given title is not exist" });
    //   }
    //   try {
    //     const newNote = await Notes.findOneAndUpdate({
    //       ...Notes,
    //       updatedNote
    //     });
    //     //console.log("New note is updated succesfully by user", res.user.id);
    //     res
    //       .status(200)
    //       .send({ result: "New note updated successfully", newNote: newNote });
    //   } catch (err) {
    //     //console.log(err.message);
    //     res.status(400).send("Internal Server Error");
    //   }
  }
);

//ROUTE 4: to delete  note. /api/delete
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  let deleteNote = await Notes.findById(req.params.id);
  if (!deleteNote) {
    return res
      .status(404)
      .send({ error: "Note with given title is not exist" });
  }
  if (deleteNote.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  deleteNote = await Notes.findByIdAndDelete(req.params.id);
  if (!deleteNote) {
    return res.status(401).send({ error: "Note can not be deleted" });
  } else {
    return res.status(200).send({ success: "Note deleted successfully" });
  }
});

module.exports = router;
