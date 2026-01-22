import express from 'express'; 
import dotenv from 'dotenv'
// import connectDB from './db/db.js';
import app from './app.js';
import {Server} from 'socket.io';
import http from "http";

dotenv.config({ 
  path: `./.env`
})

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id); 

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});



// connectDB()
// .then(() => {
//   app.on('error', (error) => {
//     console.error('error:', error);
//     throw error;
//   });
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`); 
  })


.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  throw error;
})