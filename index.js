import express from 'express'
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import {newEvent, updateEvent, addMember} from './components/event-components.js'

import 'dotenv/config.js'
import './db/mongoose.js'

import events from './routes/events.js'

const port = process.env.PORT || 5000;
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(express.json())
app.use('/events', events)

io.on("connection", (socket) => {
    const id = socket.handshake.query.id
    console.log(id, 'connected')
    socket.join(id)

    socket.on('new-event', async eventData => {
      const createdEvent = await newEvent(eventData)
      console.log('new event', createdEvent)
      createdEvent.recipients.forEach(recipient => {
        socket.to(recipient.id).emit('new-event', createdEvent)
      })
      // io.to(id).emit('new-event', createdEvent)
    })

    socket.on('add-member', async ({event, newMembers}) => {
        await addMember(event.eventId, newMembers)
        event.recipients.forEach(recipient => {
          socket.to(recipient.id).emit('added-Member', {eventId: event.eventId, newMembers} )
        })

    })

    socket.on('send-message', async ({eventId, recipients, message})=> {
      const updatedEvent = await updateEvent(eventId, message)
      console.log(updatedEvent)

        recipients.forEach(recipient => {
          console.log('message sent to:', recipient)
            socket.to(recipient).emit('receive-message', {
                eventId, recipients, sender: id, message
            })
        })
    })

    socket.on("private-message", ({recipientId, text}) => {
    console.log("private-message", {recipientId, text})
    socket.to(recipientId).emit("receive-private-message", {recipientId, text, sender: id});
    });

  });

server.listen(port, () => console.log(`Server running on port ${port}`));

