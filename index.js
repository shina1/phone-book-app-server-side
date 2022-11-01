/* eslint-disable no-unused-vars */
import express from "express";
import cors from "cors";
// import {generateDate} from "./utils/generateDate.js";
// import {generateId} from "./utils/generateId.js";
import { phonebooks } from "./phonebook.js";
import { guidGenerator } from "./utils/uuidGenerator.js";
import { requestLogger } from "./middleware/logger.js";
import { unknownEndpoint } from "./middleware/unknownEndpoint.js";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(unknownEndpoint);
app.use(cors());

//get all phonebook entries
app.get("/api/phonebooks", (req, res) => {
    res.status(200).json({
        status:"success",
        message: "Data fetched succefully",
        payload: phonebooks
    })
});

// get phonebok info
app.get("/api/phonebooks/info", (req, res) => {
    res.send(`<div>
    <h2>Phonebook has info for ${phonebooks.length} people </h2>
    <h3>${ new Date() }</h3>
    </div>`)
})

// get a single phonebook entry
app.get("/api/phonebooks/:id", (req, res) => {
    const id = Number(req.params.id);
    const phonebook = phonebooks.find(phone => phone.id === id)

   if(phonebook){
    res.status(200).json({
        status: "success",
        message: "Phonebok data found",
        payload: phonebook,
    })
   }else{
    res.status(404).json({
        status: "Faillure",
        message: `Contact with id ${id} does not exist`
    })
   }
})

//delete a phonebok entry

app.delete("/api/phonebooks/delete/:id", (req, res) => {
    const id = Number(req.params.id)

    const deleted = phonebooks.filter(phone => phone.id !== id)

    res.status(204).end()
})


app.post("/api/phonebooks/create", (req, res) => {
    const body = req.body;
    const checkName = phonebooks.find(phone => phone.name === body.name)
    if(!body.name || !body.number){
      res.status(400).json({
        status: "Failed",
        message: "No emtry name"
      })
    }
    if(checkName){
        res.status(400).json({
            status: "Failed",
            message: "Entry with such name already exist"
          })
    }
    const newPhonebook ={
      id: guidGenerator(),
      name: body.name,
      number: body.number
    }

    //   notes = notes.concat(newNote)
      res.status(200).json({
        status: "suceess",
        message: "note created",
        payload: newPhonebook
      });
  })


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server runninng on port ${PORT}`);