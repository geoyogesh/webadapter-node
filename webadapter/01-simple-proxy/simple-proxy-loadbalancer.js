/*server load balancer */
var http = require('http');
var request = require('request');

//let destinationUrl = 'http://localhost:1338';
var destinationUrls = [
    'http://sampleserver1.arcgisonline.com',
	'http://sampleserver1.arcgisonline.com'
	];
var i=0;

var port = process.env.port || 1337;
http.createServer(function (req, res) {
	if (i===destinationUrls.length) i=0;
    var reqUrl = destinationUrls[i] + req.url;
	i++;
    console.log(reqUrl);
    var options = {
        headers: req.headers,
        url: reqUrl
    };
    
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
}).listen(port);