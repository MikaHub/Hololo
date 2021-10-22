console.log('testconsole')
var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello World\n");
});

var port = process.env.PORT || 3000;
server.listen(port);