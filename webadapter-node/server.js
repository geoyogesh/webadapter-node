var http = require('http');
var request = require('request');
//let fs = require('fs')
//let destinationUrl = 'http://localhost:1338';
var destinationUrl = 'http://sampleserver1.arcgisonline.com';
//https://github.com/request/request#readme
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var reqUrl = destinationUrl + req.url;
    console.log(reqUrl);
    var options = {
        headers: req.headers,
        url: reqUrl
    };
    /*clear cache*/
    //options.headers
    //http://stackoverflow.com/questions/49547/making-sure-a-web-page-is-not-cached-across-all-browsers
    /*
    options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    options.headers['Pragma'] = 'no-cache'
    options.headers['Expires'] = 0
    */
    options.headers['if-none-match'] = 0;
    var destinationResponse = req.pipe(request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        }
    }));
    destinationResponse.pipe(res);
}).listen(port);
//# sourceMappingURL=server.js.map