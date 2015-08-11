var request = require('request');
var redis = require('redis');
var zlib = require('zlib');
var stream = require('stream');

console.log('running....');
var cacheClinet = new redis.createClient(6379,'127.0.0.1');
 

var options = {
        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services?f=json'
    };
    
    var destinationResponse = request(options,function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(response.headers);
    //'content-type': 'text/plain;charset=utf-8'
    cacheClinet.set(response.request.uri.path,body);
    
    cacheClinet.get(response.request.uri.path,function(error1,content)
      {
        console.log(content);
      });
  }
	});


var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
  
  cacheClinet.get('/ArcGIS/rest/services?f=json',function(error1,content)
      {
        /*
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
        */
        var contentStream = new stream.Readable();
        contentStream._read = function noop() {}; // redundant? see update below
        contentStream.push(content);
        contentStream.push(null);
        
        var acceptEncoding = req.headers['accept-encoding'];
        if (!acceptEncoding) {
          acceptEncoding = '';
        }

        // Note: this is not a conformant accept-encoding parser.
        // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
        if (acceptEncoding.match(/\bdeflate\b/)) {
          res.writeHead(200, { 'content-encoding': 'deflate' ,'Content-Type':'text/plain;charset=utf-8'});
          contentStream.pipe(zlib.createDeflate()).pipe(res);
        } else if (acceptEncoding.match(/\bgzip\b/)) {
          res.writeHead(200, { 'content-encoding': 'gzip','Content-Type':'text/plain;charset=utf-8' });
          contentStream.pipe(zlib.createGzip()).pipe(res);
        } else {
          res.writeHead(200, {'Content-Type':'text/plain;charset=utf-8'});
          contentStream.pipe(content);
        }
        
      });
}).listen(port);

console.log('listening to port....');