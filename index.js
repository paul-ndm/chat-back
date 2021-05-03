import express from 'express'
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
    socket.emit("test", "frombackend");
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on("test2", (arg) => {
        console.log(arg); // world
      })

    socket.on('send-message', ({recipientsIds, text})=> {
      console.log('message received')
      io.to(id).emit('receive-message', {
        recipientsIds, sender: id, text
            })
        // recipients.forEach(recipient => {
        //     socket.broadcast.to(recipient).emit('receive-message', {
        //         recipients, sender: id, text
        //     })
        // })
    })

    socket.on("chatMessage", (data) => {
    console.log('chat message', data)
    io.to(id).emit("chatMessage", data);
    });

  });

server.listen(port, () => console.log(`Server running on port ${port}`));

