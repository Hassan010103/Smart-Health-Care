const { io } = require("socket.io-client");

// Replace these with your actual values:
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjNhZmY0YTYzNDg2ZTVhZjBmMTZkNSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3NTEzNjQ2ODksImV4cCI6MTc1MTk2OTQ4OX0.1d0xdIsQQvcEj0I-7k9u6DwM2njkdpoWShmSA8lcrg4"; // JWT from login (patient or doctor)
const appointmentId = "6863b22da63486e5af0f16db"; // The appointment you want to chat in

const socket = io("http://localhost:5000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Connected to chat server!");
  socket.emit("join", { appointmentId });
  setTimeout(() => {
    socket.emit("message", { appointmentId, message: "Hello from test client!" });
  }, 1000);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("message", (msg) => {
  console.log("Received message:", msg);
});

socket.on("error", (err) => {
  console.log("Socket error:", err);
});

setTimeout(() => {
  socket.disconnect();
  console.log("Disconnected from chat server.");
}, 10000);