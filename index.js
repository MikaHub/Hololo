var port = process.env.PORT || 3030
const fs = require("fs");
const fileupload = require('express-fileupload')
var fileUploaded = null

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// ajout de socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(fileupload({ useTempFiles: true }))

var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dhffqvijh',
    api_key: '673912877356881',
    api_secret: '2fdoRfjDeVZPeMMW3sk8QsuIPw8',
});

app.get('/', (req, res) => {
    // if (fileUploaded == null) {
    //     res.send("Pas de upload")
    // } else {
    //     res.sendFile(__dirname + "/test.html");
    // }

    setInterval(function () {
        io.emit('file', fileUploaded);
    }, 1000);

    res.sendFile(__dirname + "/index.html");

});

app.post("/uploadimage", function (req, res) {
    const file = req.files.image;
    cloudinary.uploader.upload(file.tempFilePath, function (err, result) {
        fileUploaded = result.url
        io.on('connection', (socket) => {
            console.log(`Connecté au client ${socket.id}`)
            // émission d'un évènement
            io.emit('file', fileUploaded)
        })
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
            io.on('connection', (socket) => {
                console.log(`Connecté au client ${socket.id}`)
                // émission d'un évènement
                io.emit('file', fileUploaded)
            })
            res.send({
                success: true,
                result
            })
        });
})

// établissement de la connexion
io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    // émission d'un évènement
    io.emit('news', 'Voici un nouvel élément envoyé par le serveur')
})



// on change app par server
server.listen(port, function () {
    console.log(`Votre app est disponible sur localhost:${port} !`)
})