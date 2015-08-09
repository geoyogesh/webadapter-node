/// <reference path="typings/node/node.d.ts"/>
var http = require('http');
var url = require('url');
var request = require('request');
var querystring = require('querystring');

//let destinationUrl = 'http://localhost:1338';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';

var proxyBaseUrl = '/arcgis/rest/services'

var serviceMapping ={'Census/MapServer':
	{destinationUrl:'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
		dynamicLayers: '[{"id":101,"source":{"type":"mapLayer","mapLayerId":3},"drawingInfo":{"renderer": {"type":"simple", "symbol": {"type":"esriSFS","style":"esriSFSSolid","color":[255,0,0,255],"outline":{"type":"esriSLS","style":"esriSLSSolid","color":[0,255,0,255],"width":1}}}}}]'
		},'USA/MapServer':
        {destinationUrl:'http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
		dynamicLayers: '[{"id":0,"name":"Cities","source":{"type":"mapLayer","mapLayerId":0},"minScale":0,"maxScale":0},{"id":1,"name":"Highways","source":{"type":"mapLayer","mapLayerId":1},"minScale":0,"maxScale":0},{"id":2,"name":"States","source":{"type":"mapLayer","mapLayerId":2},"drawingInfo":{"renderer":{"type":"simple","symbol":{"color":[0,220,0,255],"outline":{"color":[220,220,220,255],"width":1,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"}}},"minScale":0,"maxScale":0},{"id":3,"name":"Counties","source":{"type":"mapLayer","mapLayerId":3},"minScale":0,"maxScale":0}]'
		}
        
};
/*
for (var key in config){
    serviceMapping[proxyBaseUrl+'/'+key]=config[key]
    //key will be -> 'id'
    //dictionary[key] -> 'value'
}
console.log(serviceMapping);
*/
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    //console.log(req.url);
    //console.log(url.parse(req.url))
    var hasResponse = false;
    for (var key in serviceMapping) {
        var sindex = req.url.search(key);
        if (sindex!==-1) {
           var destUrl = serviceMapping[key].destinationUrl+ req.url.substr(sindex + key.length);
           var reqp= url.parse(req.url);
        //console.log(reqp);
        if (reqp.pathname.toLocaleLowerCase().search('export')!==-1) {
            var qs= querystring.parse(url.parse(destUrl).query);
            qs['dynamicLayers'] = serviceMapping[key].dynamicLayers;
            var q= destUrl.indexOf("?");
            console.log(q);
            destUrl = destUrl.substr(0,q) +'?'+querystring.stringify(qs);
            //destUrl = destUrl + '&' + querystring.stringify({'dynamicLayers':'})
        }
        console.log(destUrl);
           var options = {
        headers: req.headers,
        url: destUrl
    };
    
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
    hasResponse = true;
    break;
        }
        
    }
    if (hasResponse===false) {
        //for routing other urls since f=html is broken
    var destResponse = req.pipe(request({
        headers: req.headers,
        url: 'http://sampleserver6.arcgisonline.com' + req.url
    }));
    console.log('http://sampleserver6.arcgisonline.com' + req.url);
    destResponse.pipe(res);
    
    }
    
    
    /*
    var reqUrl = destinationUrl + req.url;
    console.log(reqUrl);
    var options = {
        headers: req.headers,
        url: reqUrl
    	};
    
    var destinationResponse = req.pipe(request(options));
    destinationResponse.pipe(res);
    */
}).listen(port);