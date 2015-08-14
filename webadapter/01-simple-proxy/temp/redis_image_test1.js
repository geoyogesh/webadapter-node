var request = require('request');
var redis = require('redis');
var zlib = require('zlib');
var stream = require('stream');
var Buffer = require('buffer');
var fs= require('fs');
console.log('running....');
var cacheClinet = new redis.createClient(6379,'127.0.0.1',{'return_buffers': true});


var options = {
  
        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/export?dpi=96&transparent=true&format=png8&bbox=-239.40078108507683%2C-40.6075371681153%2C-5.462615771401879%2C129.89501453537&bboxSR=4269&imageSR=4269&size=756%2C551&f=image'
    };
    
    var destinationResponse = request(options,function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(response.headers);
    console.log(response.request.uri.path);
    //'content-type': 'image/png',
    //
    //cacheClinet.set(response.request.uri.path,body);
    //http://stackoverflow.com/questions/20732332/how-to-store-a-binary-object-in-redis-using-node#
    //cacheClinet.set(response.request.uri.path,new Buffer(body,'base64'));
    cacheClinet.set(response.request.uri.path,body);
    fs.writeFile('test.png', body, function(err) { console.log('print') });
    request(options).pipe(fs.createWriteStream('test1.png'))
    /*
    cacheClinet.get(response.request.uri.path,function(error1,content)
      {
        console.log(content);
      });
      */
  }
	});


var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
  
  cacheClinet.get('/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/export?dpi=96&transparent=true&format=png8&bbox=-239.40078108507683%2C-40.6075371681153%2C-5.462615771401879%2C129.89501453537&bboxSR=4269&imageSR=4269&size=756%2C551&f=image',function(error1,content)
      {
        /*
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(content);
        */
        //http://stackoverflow.com/questions/12755997/how-to-create-streams-from-string-in-node-js
        //http://www.sitepoint.com/basics-node-js-streams/
        var contentStream = new stream.Readable();
        contentStream._read = function noop() {}; // redundant? see update below
        contentStream.push(content);
        contentStream.push(null);
        
        var acceptEncoding = req.headers['accept-encoding'];
        if (!acceptEncoding) {
          acceptEncoding = '';
        }

        // Note: this is not a conformant accept-encoding parser.
        //http://stackoverflow.com/questions/3894794/node-js-gzip-compression
        // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
        if (acceptEncoding.match(/\bdeflate\b/)) {
          res.writeHead(200, { 'content-encoding': 'deflate' ,'Content-Type':'image/png'});
          contentStream.pipe(zlib.createDeflate()).pipe(res);
        } else if (acceptEncoding.match(/\bgzip\b/)) {
          res.writeHead(200, { 'content-encoding': 'gzip','Content-Type':'image/png' });
          contentStream.pipe(zlib.createGzip()).pipe(res);
        } else {
          res.writeHead(200, {'Content-Type':'image/png'});
          contentStream.pipe(content);
        }
        
      });
}).listen(port);

console.log('listening to port....');