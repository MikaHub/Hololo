console.log('testconsole')
const fs = require("fs");
const express = require('express')
const app = express()
var port = process.env.DEV || 3000;

app.get('/ping', (req, res) => {
    console.log("here")
    res.send('Hello ping')
})

app.get("/htmlvideo", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/htmlupload", function (req, res) {
    res.sendFile(__dirname + "/htmlupload.html");
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

app.post("/image_upload", function (req, res) {
    upload_image(req, function (err, data) {

        if (err) {
            return res.status(404).end(JSON.stringify(err));
        }

        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
