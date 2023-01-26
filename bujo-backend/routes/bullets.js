const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const { findById } = require("../models/Notes");
const Bullets = require("../models/Bullets");
const moment = require("moment");

//ROUTE 1: to create new bullet. /api/bullets//addbullet
router.post(
  "/addbullet",
  [
    body("bullet_text", "Please provide valid title for note").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    console.log("errors", errors);
    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { bullet_text, tag, status, progress, schedule_date, important } = req.body;
    console.log('bullet_text',bullet_text);
    let getBullet = await Bullets.findOne({
      $and: [{ title: req.body.bullet_text, userID: res.user.id }],
    });
    console.log(getBullet);
    if(getBullet) {
      return res.status(401).send({ error: "Bullet is already added" });
    }
    try {
      const newBullet = await Bullets.create({
        bullet_text: bullet_text,
        userID: res.user.id,
        tag: tag,
        status,
        progress,
        schedule_date,
        important,
      });
      //console.log("New note is created succesfully by user", res.user.id);
      res.status(200).send({
        result: "New bullet is added successfully",
        newBullet: newBullet,
      });
    } catch (err) {
      //console.log(err.message);
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 2: to get all bullets from user. /api/bullets/getallbullets
router.get("/getallbullets", fetchuser, async (req, res) => {
  try {
    //console.log("x", res.user.id);
    let current_Date = moment().format("YYYY-MM-DD");
    console.log(current_Date);
    let listOfBullets = await Bullets.find({
      $and: [{ userID: res.user.id, schedule_date: current_Date }],
    });
    //console.log(listOfNotes);
    res.status(200).send({ Bullets: listOfBullets });
  } catch (err) {
    //console.log(err.message);
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 3: to update existing note./api/bullets/updatebullet
router.put(
  "/updatebullet/:id",
  [
    body("bullet_text", "Please provide valid title for note").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { bullet_text, tag } = req.body;
    let updatedBullet = {};
    if (title) {
      updatedBullet.bullet_text = bullet_text;
    }
    if (tag) {
      updatedBullet.tag = tag;
    }

    //Find by id
    let exitingBullet = await Bullets.findById(req.params.id);
    //console.log("existingNote", exitingNote, req.params.id);
    if (!exitingBullet) {
      return res.status(404).send({ error: "Bullet does not exist" });
    }

    if (exitingBullet.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    exitingBullet = await Bullets.findByIdAndUpdate(
      req.params.id,
      { $set: exitingBullet },
      { new: true }
    );
    res.send(exitingBullet);
  }
);

//ROUTE 4: to delete  note. /api/bullets//deletebullet
router.delete("/deletebullet/:id", fetchuser, async (req, res) => {
  let deletebullet = await Bullets.findById(req.params.id);
  if (!deletebullet) {
    return res.status(404).send({ error: "Bullet is not exist" });
  }
  if (deletebullet.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  deletebullet = await Bullets.findByIdAndDelete(req.params.id);
  if (!deletebullet) {
    return res.status(401).send({ error: "Note can not be deleted" });
  } else {
    return res.status(200).send({ success: "Note deleted successfully" });
  }
});

//ROUTE 5: to update status of task. /api/bullets/updatestatus
router.put("/updatestatus/:id", fetchuser, async (req, res) => {
  const { status } = req.body;
  let bulletStatus = {};
  if (status) {
    bulletStatus.status = status;
  }

  //Find by id
  let existingBullet = await Bullets.findById(req.params.id);
  //console.log("existingNote", exitingNote, req.params.id);
  if (!existingBullet) {
    return res.status(404).send({ error: "Bullet is not exist" });
  }

  if (existingBullet.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  existingBullet = await Bullets.findByIdAndUpdate(req.params.id, {
    $set: bulletStatus,
  });
  res.send(bulletStatus);
});

//ROUTE 6: to reschedule task. /api/bullets//reschedule
router.put("/reschedulebullet/:id", fetchuser, async (req, res) => {
  const { schedule_date } = req.body;
  let bulletReschedule = {};
  if (schedule_date) {
    bulletReschedule.schedule_date = schedule_date;
  }

  //Find by id
  let existingBullet = await Bullets.findById(req.params.id);
 
  if (!existingBullet) {
    return res.status(404).send({ error: "Bullet is not exist" });
  }

  if (existingBullet.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  existingBullet = await Bullets.findByIdAndUpdate(req.params.id, {
    $set: bulletReschedule,
  });
  res.send(existingBullet);
});

//ROUTE 6: to reschedule task. /api/bullets/updateprogress
router.put("/updateprogress/:id", fetchuser, async (req, res) => {
  const { progress } = req.body;
  let bulletProgress = {};
  if (bulletProgress) {
    bulletProgress.progress = progress;
  }

  //Find by id
  let existingBullet = await Bullets.findById(req.params.id);
  //console.log("existingNote", exitingNote, req.params.id);
  if (!existingBullet) {
    return res.status(404).send({ error: "Bullet is not exist" });
  }

  if (existingBullet.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  existingBullet = await Bullets.findByIdAndUpdate(req.params.id, {
    $set: bulletProgress,
  });
  res.send(existingBullet);
});

module.exports = router;
