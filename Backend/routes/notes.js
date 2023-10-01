const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all th notes using GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});


// ROUTE 2: Add new note using POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title should have atleast 3 characters.').isLength({ min: 3 }),
    body('description', 'Description should have atleast 5 characters.').isLength({ min: 5 }),
], async (req, res) => {

    // Fetching note details from request.
    const { title, description, tag } = req.body;

    // Validating if the required fields are valid.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Adding a new note
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 3: Update an existing note using PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    // Fetching note details from request.
    const { title, description, tag } = req.body;

    try {
        // Creating a new note object.
        const newNote = {};

        // Updating the new note object
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Finding the note to be updated.
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        // To prevent one user updating another's notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied! ");
        }

        // Updating the notes
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 4: Deleting an existing note using DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        // Finding the note to be deleted.
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        // To prevent one user deleting another's notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied! ");
        }

        // Deleting the notes
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted.", note: note });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.");
    }
});

module.exports = router;