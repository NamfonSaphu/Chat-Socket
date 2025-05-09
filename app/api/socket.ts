import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", socket => {
      console.log("New user connected");

      socket.on("send-message", msg => {
        socket.broadcast.emit("receive-message", msg);
      });
    });
  }
  res.end();
}
