import express from "express";
import http from "http";
import path from "path";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

const httpServer = http.createServer(app);

const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
