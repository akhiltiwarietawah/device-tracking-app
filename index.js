const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// CORS configuration for Socket.io
const io = socketio(server, {
  cors: {
    origin: "https://device-tracking-mts183a1s-akhil-tiwaris-projects.vercel.app", // Allow your Vercel URL
    methods: ["GET", "POST"],
    credentials: true // Allow cookies and credentials if necessary
  }
});

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection handling
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
