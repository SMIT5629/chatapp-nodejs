const socket = io();
const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "index.html";
} else {
  socket.emit("setUsername", username);
}

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");

function sendMessage() {
  const msg = input.value.trim();
  if (msg) {
    socket.emit("chatMessage", msg);
    input.value = '';
  }
}

function requestHistory() {
  socket.emit("getChatHistory");
} 

socket.on("chatHistory", (history) => {
  messages.innerHTML = "";
  history.forEach(data => {
    const item = document.createElement("li");
    item.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(item);
  });
});

socket.on("chatMessage", (data) => {
  const item = document.createElement("li");
  item.textContent = `${data.username}: ${data.message}`;
  messages.appendChild(item);
});

socket.on("userJoined", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  item.style.color = "green";
  messages.appendChild(item);
});

socket.on("userLeft", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  item.style.color = "red";
  messages.appendChild(item);
});

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
}

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent page reload
  sendMessage();
}
