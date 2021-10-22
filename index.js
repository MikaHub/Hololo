console.log('testconsole')
const express = require('express')
const app = express()

var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World1");
});

app.get('/test', (req, res) => {
    console.log("here")
    res.send('Hello Test')
})

var port = process.env.PORT || 3000;
server.listen(port);