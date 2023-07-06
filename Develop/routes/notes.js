const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dbFilePath = path.join(__dirname, '..', 'db', 'db.json');

// GET /api/notes - Retrieve all notes
router.get('/', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while retrieving the notes.' });
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// POST /api/notes - Create a new note
router.post('/', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while saving the note.' });
    }
    const notes = JSON.parse(data);
    const newNote = { id: Date.now(), ...req.body };
    notes.push(newNote);
    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }
      res.json(newNote);
    });
  });
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while deleting the note.' });
    }
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    fs.writeFile(dbFilePath, JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while deleting the note.' });
      }
      res.sendStatus(204);
    });
  });
});

module.exports = router;
