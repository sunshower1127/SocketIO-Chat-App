const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");

const roomList = document.getElementById("room_list");

room.hidden = true;

let roomName;

function addMessage(message, nick = "") {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = (nick ? nick + ": " : "") + message;
  ul.appendChild(li);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

welcome.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const roomInput = document.getElementById("room_name");
  roomName = roomInput.value;

  const nickInput = document.getElementById("nick_name");
  const nickName = nickInput.value;

  socket.emit("enter_room", roomName, nickName, showRoom);
});

room.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const messageInput = document.getElementById("message");
  const message = messageInput.value;
  socket.emit("new_message", message, roomName, () => {
    addMessage(message, "나");
    messageInput.value = "";
  });
});

socket.on("welcome", (user, count) => {
  addMessage(user + "님이 입장했습니다.");
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
});

socket.on("bye", (user, count) => {
  addMessage(user + "님이 퇴장했습니다.");
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
});

socket.on("message", addMessage);

socket.on("room_change", (rooms) => {
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
