/// <reference path="typings/node/node.d.ts"/>

var http = require('http');
var url = require('url');
var querystring = require('querystring');
var request = require('request');
var utils = require("./modules/utils.js");

//let destinationUrl = 'http://localhost:1337';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';
var isAuthenticated = true;
var token;


var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var urlp = url.parse(req.url);
    var resourceUrl = url.parse(urlp.query);
    if (urlp.pathname.toLowerCase() === '/proxy.js') {
        if (isAuthenticated==true)
        {
            if (token===undefined) {
                token = utils.getArcGISServerToken();
                console.log(token);
            }
            var qs= querystring.parse(resourceUrl.query);
            qs['token'] = token;
            resourceUrl = url.parse(url.resolve(resourceUrl.href,'?'+querystring.stringify(qs)));
        }

        var options = {
            headers: req.headers,
            url: resourceUrl
        };
        var destinationResponse = req.pipe(request(options));
        destinationResponse.pipe(res);
    }
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('invalid path');
    }
}).listen(port);

/*
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(req.url);
}).listen(1338);
*/