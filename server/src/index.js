const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: { // <-- Fix the typo here
        origin: "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});
// Configure CORS to allow requests from your frontend origin
io.on("connection", function (socket) {
    socket.on("new-operations", function (data) {
        io.emit("new-remote-operations", data);
    });
});


http.listen(4000, function () {
    console.log("listening on *:4000");
});

