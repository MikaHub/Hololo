console.log('testconsole')
const express = require('express')
const app = express()

var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World\n");
});

app.get('/test', (req, res) => {
    res.send('Hello World')
})

var port = process.env.PORT || 3000;
server.listen(port);