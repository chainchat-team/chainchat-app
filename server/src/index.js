const app = require("express")();
const cors = require("cors");
const http = require("http").Server(app);
const options = {
    cors: { // <-- Fix the typo here
        origin: "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST", "FETCH"],
        credentials: true
    }
}
const io = require("socket.io")(http, options);
app.use(cors(options.cors))
let value = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
    },
]
// Configure CORS to allow requests from your frontend origin
io.on("connection", function (socket) {
    socket.on("new-operations", function (data) {
        value = data.value
        io.emit("new-remote-operations", data);
    });
});

// Add an HTTP GET route to fetch the initial value
app.get("/initial-value", (req, res) => {
    // You can send the initial value as JSON
    res.json(value);
});

http.listen(4000, function () {
    console.log("listening on *:4000");
});

