/// <reference path="typings/node/node.d.ts"/>

var http = require('http');
var url = require('url');
var request = require('request');
var utils = require("./modules/utils.js");

//let destinationUrl = 'http://localhost:1337';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';
var isAuthenticated = 'true';
var tokens;


var port = process.env.port || 1337;
http.createServer(function (req, res) {
    tokens = utils.getArcGISServerToken();
    console.log(tokens);
    var urlp = url.parse(req.url);
    if (urlp.pathname.toLowerCase() === '/proxy.js') {
        var reqUrl = urlp.query;
        console.log(req.url);
        var options = {
            headers: req.headers,
            url: reqUrl
        };

        var destinationResponse = req.pipe(request(options));
        destinationResponse.pipe(res);
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('invalid path');
    }
}).listen(port);