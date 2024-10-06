const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketio(server, {
  cors: {
    origin: [
      "https://device-trackingbyakhiltiwari.vercel.app",
      "https://device-tracking.vercel.app" // Your production URL
    ],
    methods: ["GET", "POST"],
    credentials: true // Allow cookies if needed
  }
});

// Set EJS as the view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);

  socket.on("send-location", function (data) {
    io.emit("recive-location", {
      id: socket.id,
      ...data,
    });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
    console.log("User disconnected: " + socket.id);
  });
});

// Route to render the index page
app.get("/", function (req, res) {
  res.render("index");
});

// Start the server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
