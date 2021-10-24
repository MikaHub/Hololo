const fs = require("fs");
const express = require('express')
const fileupload = require('express-fileupload')
const app = express()
require('dotenv').config();

var port = process.env.PROD || 3000;
console.log(port)
var fileUploaded = null

app.use(fileupload({ useTempFiles: true }))

var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
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
        res.send(fileUploaded)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

