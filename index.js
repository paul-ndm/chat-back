import express from 'express'
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'

//import contacts from './routes/contacts.js'

const port = process.env.PORT || 5000;
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on("connection", (socket) => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({eventId, recipients, message})=> {
      // io.to(id).emit('receive-message', {eventId,
      //   recipients, sender: id, message
      //       })
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

