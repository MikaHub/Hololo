console.log('testconsole')
const fs = require("fs");
const express = require('express')
const app = express()
var port = process.env.PORT || 3000;
console.log("port:" + port)
console.log(process.env.PORT)
console.log(process.env)

app.get('/ping', (req, res) => {
    console.log("here")
    res.send('Hello ping')
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/stream', (req, res) => {

    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)
    const videoPath = "https://github.com/Abdisalan/blog-code-examples/blob/master/http-video-stream/bigbuck.mp4?raw=true";
    const videoSize = fs.statSync("https://github.com/Abdisalan/blog-code-examples/blob/master/http-video-stream/bigbuck.mp4?raw=true").size;

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
