const fs = require("fs");
const express = require('express')
const app = express()
const fileupload = require('express-fileupload')
const WebSocket = require('ws');

var port = process.env.PORT || 3000
var fileUploaded = null

const wsServer = new WebSocket.Server({ server: "https://hololo.herokuapp.com/" })

app.use(fileupload({ useTempFiles: true }))


var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dhffqvijh',
    api_key: '673912877356881',
    api_secret: '2fdoRfjDeVZPeMMW3sk8QsuIPw8',
});

app.get('/ping', (req, res) => {
    res.send('Hello ping')
})

app.get("/videostreaming", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/stream', (req, res) => {

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)
    const videoPath = "video.mp4";
    const videoSize = fs.statSync("video.mp4").size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
})

app.post("/uploadimage", function (req, res) {
    const file = req.files.image;
    cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
        fileUploaded = result.url

        wsServer.on('connection', function connection(socket) {
            socket.send('Welcome New Client!');
            socket.on('message', function incoming(message) {
                wsServer.clients.forEach(function (ws) {
                    ws.send(fileUploaded);
                });
            });
        });
        res.send({
            success: true,
            result
        })
    });
})

app.post("/uploadvideo", function (req, res) {
    const file = req.files.video;
    cloudinary.uploader.upload(file.tempFilePath,
        {
            resource_type: "video",
            chunk_size: 6000000,
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
            eager_async: true,
        },
        function (error, result) {
            fileUploaded = result.url
            wsServer.on('connection', function connection(socket) {
                socket.send('Welcome New Client!');
                socket.on('message', function incoming(message) {
                    wsServer.clients.forEach(function (ws) {
                        ws.send(fileUploaded);
                    });
                });
            });
            res.send({
                success: true,
                result
            })
        });
})

app.get('/get', (req, res) => {
    if (fileUploaded == null) {
        res.send("Pas de upload")
    } else {
        app.use("/static", express.static('./static'));
        res.sendFile(__dirname + "/test.html");
        //res.send(fileUploaded)
    }
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})