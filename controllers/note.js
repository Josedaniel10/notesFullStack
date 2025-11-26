const notesRouter = require('express').Router()
const Note = require('../models/note.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')

notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).json({ error: 'Recurso no encontrado' })
  }
})

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await Note.findByIdAndDelete(id);
  res.status(200).json({ message: 'Recurso eliminado correctamente' });
})

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), config.JWT_SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content,
    important: Boolean(important) || false,
    user: user.id
  })

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

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