const notesRouter = require('express').Router();
const Note = require('../models/note.js');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes);
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note) {
    res.json(note)
  } else {
    res.status(404).json({ error: 'Recurso no encontrado' });
  }
})

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndDelete(id);
  res.status(200).json({ message: 'Recurso eliminado correctamente' });
})

notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body;
  const note = new Note({
    content,
    important: Boolean(important) || false,
  })

  const savedNote = await note.save();
  res.status(201).json(savedNote);
})

notesRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { content, important } = req.body;

  const note = {
    content,
    important
  }
  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' });
  res.json(updatedNote);
})

module.exports = notesRouter;