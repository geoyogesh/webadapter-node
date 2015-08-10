var http = require('http');
var request = require('request');
var redis = require('redis');
var cacheClinet = new redis.createClient(6379,'127.0.0.1');

//let destinationUrl = 'http://localhost:1338';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';

cacheClinet.on('error',function(error){
  console.log('error openingup the connection');
});

var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var reqUrl = destinationUrl + req.url;
    console.log(reqUrl);
      cacheClinet.get(req.url,function (err, result) {
      console.log(result);
      
  if (!err && result !== null) {
        var resp = JSON.parse(result);
        //res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8','content-encoding':'gzip','content-length':'292' });
        //res.end(result);
        //res.end('hi');
        //res.end(resp.body)
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(resp);
    }
     else{
      
      var options = {
        headers: req.headers,
        url: reqUrl
    };
    
    var destinationResponse = req.pipe(request(options,function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //console.log(req.url);
    console.log(response.headers['content-encoding']);
    console.log(response.headers['content-length']);
    console.log(response.headers['content-type']);
    var cacheContent={'header':
                      [
                        {'content-encoding':response.headers['content-encoding']},
                        {'content-length':response.headers['content-length']},
                        {'content-type':response.headers['content-type']}
                      ],
                      'body':body
                      };
      var cacheClinet1 = new redis.createClient(6379,'127.0.0.1');
      cacheClinet1.set(req.url, JSON.stringify(cacheContent));
    console.log(body) // Show the HTML for the Google homepage.
  }
}));
    destinationResponse.pipe(res);
      
    }
    
});
    
   
    
    
    
}).listen(port);