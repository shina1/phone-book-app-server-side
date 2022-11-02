/* eslint-disable no-unused-vars */
// import http from "http";
import dotenv from "dotenv"
import express from "express";
import { generateDate } from "./utils/generateDate.js";
import { generateId } from "./utils/generateId.js";
import cors from "cors";
import { requestLogger } from "./middleware/logger.js";
import  Note  from "./models/notesModel.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { unknownEndpoint } from "./middleware/unknownEndpoint.js";
// import persons from "./db.json"
dotenv.config();
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
//     res.writeHead(200, { "Content-Type" : "text/plain" });
//     res.end(JSON.stringify(notes));
// });
const app = express();

app.use(express.json())
app.use(requestLogger)
app.use(cors())

app.get("/",( req, res ) => {
  res.send("<h1>Welcome to your notes application</h1>");
})

// create a new note
app.post( "/api/v1/notes", (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get("/api/v1/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.delete("/api/v1/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get("/api/v1/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.put("/api/v1/notes/:id", (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})


app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = 3005;
app.listen(PORT)
console.log(`Server runninng on port ${PORT}`);
