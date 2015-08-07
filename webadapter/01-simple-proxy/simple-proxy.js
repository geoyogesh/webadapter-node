var http = require('http');
var request = require('request');

//let destinationUrl = 'http://localhost:1338';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';

var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var reqUrl = destinationUrl + req.url;
    console.log(reqUrl);
    var options = {
        headers: req.headers,
        url: reqUrl
    };
    
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
}).listen(port);