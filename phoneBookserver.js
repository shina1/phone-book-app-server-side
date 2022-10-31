import http from "http";
import express from 'express';
import {generateDate} from "./utils/generateDate.js";
import {generateId} from "./utils/generateId.js";
// import persons from "./db.json"

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]
  let  persons = [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: 1
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: 2
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: 3
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: 4
    }
  ]

// const app = http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type' : 'text/plain' });
//     res.end(JSON.stringify(notes));
// });
const app = express();

app.use(express.json())

app.get('/',(req, res)=> {
  res.send('<h1>Hello World!</h1>');
})

app.get('/api/notes', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "data fetched succefully",
    payload: notes
  })
})
app.get('/api/note/:id', (req, res)=> {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id)
  // console.log(typeof id);
 if(note){
  res.status(200).json(
    {
      status: "success",
      message: "data fetched succefully",
      payload: note
    }
  )
 }else {
  res.status(404).json(
    {
      status: "Failed",
      message: "data not found",
    }
  )
 }
});

app.delete('/api/note/delete/:id', (req, res)=> {
  const id = Number(req.params.id);
  const returnedNotes = notes.filter(note => note.id !== id)
  res.status(204).json(
    {
      status: "success",
      message: "data deleted succefully",
    }
  )
});

app.post('/api/note/create', (req, res)=>{
  const body = req.body;

  if(!body.content){
    res.status(400).json({
      status: "Failed",
      message: "No body content"
    })
  }
  const newNote ={
    id: generateId(notes),
    content: body.content,
    date: generateDate(),
    important: body.important || false
  }
 
    notes = notes.concat(newNote)
    res.status(200).json({
      status: "suceess",
      message: 'note created',
      payload: newNote
    });
})

app.get('/api/persons', (req, res) => {
  res.status(200).json({
    status: "success",
    message: "data fetched succefully",
    payload: persons
  })
})

const PORT = 3005;
app.listen(PORT)
console.log(`Server runninng on port ${PORT}`);
