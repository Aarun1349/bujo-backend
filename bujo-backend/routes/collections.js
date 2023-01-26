const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Collections = require("../models/Collections");
const { body, validationResult } = require("express-validator");
//ROUTE 1: to create new collection. /api/collection/createcollection
router.post(
  "/createcollection",
  [
    body("collection_name", "Please provide valid title for note").isLength({
      min: 3,
    }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      res.status(500).send({ errors: errors.array() });
    }
    const { collection_name } = req.body;
    let getCollection = await Collections.findOne({
      $and: [{ collection_name: collection_name, userID: res.user.id }],
    });
    if (getCollection) {
      return res.status(401).send({ error: "Collection is already exist" });
    }
    try {
      const newCollection = await Collections.create({
        collection_name: collection_name,
        userID: res.user.id,
        collection_items: [],
      });
      ////consolelog("New note is created succesfully by user", res.user.id);
      res.status(200).send({
        result: "New Collection added successfully",
        collection: newCollection,
      });
    } catch (err) {
      //consolelog(err.message);
      res.status(400).send("Internal Server Error");
    }
  }
);

//ROUTE 2: to get all collection from user. /api/collection/getallnotes
router.get("/getcollectionitems/:id", fetchuser, async (req, res) => {
  try {
    ////consolelog("x", res.user.id);
    let items = await Collections.findById(req.params.id);
    ////consolelog(listOfNotes);
    res.status(200).send({ collection: items });
  } catch (err) {
    ////consolelog(err.message);
    res.status(400).send("Internal Server Error");
  }
});



//ROUTE 2: to add item to collection. /api/collection/additemtocollection
router.put("/additemtocollection/:id", fetchuser, async (req, res) => {
  try {
    let collection = await Collections.findById(req.params.id);
    //consolelog("collection", collection);

    let item = req.body.item;
    //consolelog("item", item);
    let indexOfitem = collection.collection_items.indexOf(item);
    //consolelog("indexOfitem", indexOfitem);
    if (indexOfitem !== -1) {
      return res
        .status(401)
        .send({ error: "Item already added to collection" });
    }
    if (item) {
      
      collection.collection_items.push({item,done:false});
    }
    if (collection.userID.toString() !== res.user.id) {
      return res.status(401).send({ error: "Unauthorized access" });
    }

    collection = await Collections.findByIdAndUpdate(req.params.id, {
      $set: collection,
    });

    res.status(200).send({ "updated Collection": collection });
  } catch (err) {
    ////consolelog(err.message);
    res.status(400).send("Internal Server Error");
  }
});

//ROUTE 3: to update existing note. /api/updatenote
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

//ROUTE 4: to delete item from collection. /api/collections/deleteitem
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

//ROUTE 4: to delete  collection. /api/collections/deletecollection
router.delete("/deletecollection/:id/", fetchuser, async (req, res) => {
  //   let deleteItem = await Collections.findById(req.params.id);
  let collection = await Collections.findById(req.params.id);

  if (collection.userID.toString() !== res.user.id) {
    return res.status(401).send({ error: "Unauthorized access" });
  }

  collection = await Collections.findByIdAndDelete(req.params.id);
  if (!collection) {
    return res.status(401).send({ error: "Collection can not be deleted" });
  } else {
    return res.status(200).send({ success: "Collection deleted successfully" });
  }
});

module.exports = router;
