import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./DB/db.js";
import app from "./app.js";

dotenv.config();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "https://task-tracker-system.vercel.app || http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
