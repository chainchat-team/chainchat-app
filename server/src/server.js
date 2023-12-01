import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { ExpressPeerServer } from 'peer';

const options = {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "FETCH"],
        credentials: true
    }
}

const app = express();
const configPath = './peerjs-config.json'; // Path to your configuration file

app.get('/test', (req, res) => {
    res.send('helloworld');
});

// Load the PeerJS server configuration
const config = JSON.parse(readFileSync(configPath, 'utf8'));

// Start the Express server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});

// Create an ExpressPeerServer with the specified configuration
const peerServer = ExpressPeerServer(server, {
    path: config.path,
    // alive_timeout: 1000
});

// Mount the PeerJS server as middleware
app.use(cors(options.cors));
app.use(peerServer);

peerServer.on('connection', (client) => {
    console.log(`Client connected: ${client.getId()}`)
})
peerServer.on('disconnect', (client) => {
    console.log(`Client disconncted: ${client.getId()}`)
})
// peerServer.on('ping', (client, message) => {
//     console.log(`Client messaged: ${client.getId()}, message: ${message}`)
// })

