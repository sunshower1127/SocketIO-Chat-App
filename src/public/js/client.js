const socket = io();

socket.on("welcome", () => {
  console.log("Someone joined");
});
