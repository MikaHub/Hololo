const express = require('express')
const app = express()

var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World\n");
});
server.listen(8000);

app.get('/test', (req, res) => {
    res.send('Hello World')
})