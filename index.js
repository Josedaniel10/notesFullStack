const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

function generateID(object) {
  return object.length > 0 ? object[object.length - 1].id + 1 : 0
}

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/', (req, res)=> {
    res.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (req, res)=> {
  res.json(notes);
})

app.get('/api/notes/:id', (req, res)=> {
  const id = req.params.id;
  const note = notes.find(n => n.id.toString() === id);

  note ? res.json(note) : res.status(404).json({error: 'Recurso no encontrado'});
})

app.delete('/api/notes/:id', (req, res)=> {
  const id = req.params.id;
  notes.filter(n => n.id.toString() !== id);

  res.status(200).json({message: 'Recurso eliminado correctamente'});
})

app.post('/api/notes', (req, res)=> {
  const {content, important} = req.body;
  console.log(req.headers)

  if(!content) {
    res.status(400).json({error: 'content esta vacio'});
    return;
  }

  const newNote = {
    content,
    important: Boolean(important) || false,
    id: generateID(notes)
  }

  notes = notes.concat(newNote);
  res.json(newNote);
})

app.listen(PORT, ()=> {
    console.log(`Ejecutando servidor desde http://localhost:${PORT}`)
})