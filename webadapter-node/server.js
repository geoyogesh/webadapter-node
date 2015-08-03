var http = require('http');
var request = require('request');
//let destinationUrl = 'http://localhost:1338';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';
//https://github.com/request/request#readme
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var options = {
        headers: req.headers,
        url: destinationUrl + req.url
    };
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
}).listen(port);
//# sourceMappingURL=server.js.map