const express = require("express");
const router = express.Router();
const Habbits = require("../models/Habbits");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
// const { findById } = require("../models/Notes");

//ROUTE 1: to create new habbit. /api/habbit

router.post(
  "/createhabbit",
  [
    body("habbit_name", "Please provide valid title for note").isLength({ min: 3 }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { habbit_name } = req.body;
    let getHabbitById = await Habbits.findOne({
      $or: [{ habbit_name: req.body.habbit_name, userID: res.user.id }],
    });
    if (getHabbitById) {
      return res
        .status(401)
        .send({ error: "Habbit  with similar name is already exist" });
    }
    try {
      const newHabbit = await Habbits.create({
        habbit_name: habbit_name,
        userID: res.user.id,
        
      });
      
      res
        .status(200)
        .send({ result: "New Habbit added successfully", newHabbit: newHabbit });
    } catch (err) {
     console.log(err.message)
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 2: to get all habbits from user. /api/getallhabbits
router.get("/gethabbit/:id", fetchuser, async (req, res) => {
  try {
    
    let habbit = await Habbits.find({ id: res.user.id });
    
    res.status(200).send({ Habbits: habbit });
  } catch (err) {
    
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 3: to update existing note. /api/updatenote
router.put(
  "/updatehabbit/:id",
  [
    body("habbit_name", "Please provide valid title for note").isLength({ min: 3 }),
   
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { habbit_name,time,description } = req.body;
    let updateHabbit = {};
    if (habbit_name) {
      updateHabbit.habbit_name = habbit_name;
    }
    if (description) {
      updateHabbit.description = req.body.description;
    }
    if (time) {
        updateHabbit.time = req.body.time;
      }
   

    //Find by id
    let existingHabbit = await Habbits.findById(req.params.id);
    
    if (!existingHabbit) {
      return res
        .status(404)
        .send({ error: "Habbit  with given title is not exist" });
    }

    if (existingHabbit.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    existingHabbit = await Habbits.findByIdAndUpdate(
      req.params.id,
      { $set: updateHabbit },
      { new: true }
    );
    res.send(updateHabbit);
    
  }
);

//ROUTE 4: to delete  note. /api/delete
router.delete("/removehabbit/:id", fetchuser, async (req, res) => {
  let deleteHabbit = await Habbits.findById(req.params.id);
  if (!deleteHabbit) {
    return res
      .status(404)
      .send({ error: "Habbit with given title is not exist" });
  }
  if (deleteHabbit.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  deleteHabbit = await Habbits.findByIdAndDelete(req.params.id);
  if (!deleteHabbit) {
    return res.status(401).send({ error: "Habbit can not be deleted" });
  } else {
    return res.status(200).send({ success: "Habbit deleted successfully" });
  }
});

module.exports = router;
