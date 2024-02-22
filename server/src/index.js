const app = require("express")();
const cors = require("cors");
const http = require("http").Server(app);
const options = {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "FETCH"],
        credentials: true
    }
}
const io = require("socket.io")(http, options);
app.use(cors(options.cors))


let initialEditorvalue = [
    {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.', characters: [] }],
    },
]

let groupData = {}
io.on("connection", function (socket) {
    socket.on("new-operations", function (data) {
        groupData[data.groupId] = data.value
        io.emit(`new-remote-operations-${data.groupId}`, data);
    });
});


app.get("/groups/:id", (req, res) => {
    const { id } = req.params;
    if (!(id in groupData)) {
        groupData[id] = initialEditorvalue
    }
    res.send(groupData[id])
})

http.listen(4000, function () {
    console.log("listening on *:4000");
});

