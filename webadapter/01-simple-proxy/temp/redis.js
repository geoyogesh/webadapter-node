var request = require('request');
var redis = require('redis');

console.log('running....');

//var cacheClinet = new redis.createClient(6379,'127.0.0.1');
var cacheClinet = new redis.createClient(6379,'127.0.0.1',{'return_buffers': true});
 

var options = {
        //headers: {'Accept-Encoding':'Accept-Encoding:gzip, deflate, sdch'},
        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services?f=json'
    };
    
    var destinationResponse = request(options,function (error, response, body) {
  if (!error && response.statusCode == 200) {
    
    //console.log(response);
	  //console.log(body);
    console.log(response.request.uri.path);
    
    
    //storing json
    //cacheClinet.set(response.request.uri.path,body); // for ancii encoding
    cacheClinet.set(response.request.uri.path,new Buffer(body));
    
    cacheClinet.get(response.request.uri.path,function(error1,content)
      {
        //console.log(content);
        console.log(content.toString('binary'));
      });
  }
	});

  
  //array of string
  /*
  cacheClinet.hmset("myhashkey",{a:1, b:2, c:'yogesh'})
  cacheClinet.hgetall("myhashkey", function(err,obj) {
   console.log(obj);
});
*/