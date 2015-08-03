import http = require('http');
let request = require('request')

//let destinationUrl = 'http://localhost:1338';
let destinationUrl = 'http://sampleserver1.arcgisonline.com';
//https://github.com/request/request#readme

var port = process.env.port || 1337
http.createServer(function (req, res) {
    let options = {
        headers: req.headers,
        url: destinationUrl + req.url
    }

    let destinationResponse = req.pipe(request(options))
    destinationResponse.pipe(res)
}).listen(port);