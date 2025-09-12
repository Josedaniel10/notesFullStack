require('dotenv').config()
const express = require('express');
const cors = require('cors');
const Note = require('./models/note.js');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('<h1>Para accceder a la API escribe /api/notes en la url</h1>')
})

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes);
})

app.get('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const note = await Note.findById(id);
    if (note) {
      res.json(note)
    } else {
      res.status(404).json({ error: 'Recurso no encontrado' });
    }
  } catch (err) {
    next(err);
  }
})

app.delete('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleteNote = await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Recurso eliminado correctamente' });
  } catch (err) {
    next(err);
  }
})

app.post('/api/notes', async (req, res, next) => {
  const { content, important } = req.body;

  try {
    const note = new Note({
      content,
      important: Boolean(important) || false,
    })

    const savedNote = await note.save();
    res.json(savedNote);
  } catch (err) {
    next(err);
  }
})

app.put('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  const { content, important } = req.body;

  const note = {
    content,
    important
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }

})

const unKonownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unKonownEndpoint)

const errorhandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err);
}

app.use(errorhandler);

app.listen(PORT, () => {
  console.log(`Ejecutando servidor desde http://localhost:${PORT}`)
})