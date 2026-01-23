import { io } from "socket.io-client";

const socket = io("http://localhost:5000 || https://task-tracker-backend.onrender.com", {
  transports: ["websocket"]
});


export default socket;
