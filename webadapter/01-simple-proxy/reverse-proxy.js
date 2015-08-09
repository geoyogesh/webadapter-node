var http = require('http');
var request = require('request');

//let destinationUrl = 'http://localhost:1338';
//var destinationUrl = 'http://sampleserver1.arcgisonline.com';

var mapping ={'localhost:1337':'http://sampleserver1.arcgisonline.com'}

var port = process.env.port || 1337;
http.createServer(function (req, res) {
    //console.log(req.connection.remoteAddress)
    console.log(req.connection)
    if ('host' in req.headers && req.headers['host'] != undefined ) {
        var reqUrl = mapping[req.headers['host']] + req.url;
    console.log(reqUrl);
    var options = {
        headers: req.headers,
        url: reqUrl
    };
    
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
    }
    else    
    {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('invalid host reqest');
    }
    
}).listen(port);