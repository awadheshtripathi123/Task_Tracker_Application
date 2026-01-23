import { io } from "socket.io-client";

const socket = io("https://task-tracker-application-1-3iyx.onrender.com", {
  transports: ["websocket"]
});


export default socket;
