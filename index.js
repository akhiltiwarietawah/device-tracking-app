const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Update the allowed origins here
const io = socketio(server, {
    cors: {
        origin: [
            "https://device-tracking-mts183a1s-akhil-tiwaris-projects.vercel.app", // Your first Vercel URL
            "https://device-tracking-e3s4620qe-akhil-tiwaris-projects.vercel.app" // Add your second Vercel URL here
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

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

app.get("/", function (req, res) {
    res.render("index");
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
