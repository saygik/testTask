const path = require('path');
var fs = require("fs");

function route(handle, pathname, response, request) {
    const ext = path.parse(pathname).ext;
    const mimeType = {
        '.js': 'text/javascript',
        '.css': 'text/css'
    };
    var filePath='.'+pathname;
    if (ext==".js" || ext==".css") {
        fs.exists(filePath, function (exist) {
            if(!exist) {
                // if the file is not found, return 404
                response.statusCode = 404;
                response.end('File not found:'+ pathname);
                return;
            }
            // read file from file system
            fs.readFile(filePath, function(err, data){
                if(err){
                    response.statusCode = 500;
                    response.end('Error getting the file:' + pathname);
                } else {
                    // if the file is found, set Content-type and send data
                    response.setHeader('Content-type', mimeType[ext] || 'text/plain' );
                    response.end(data);
                    return;
                }
            });
        });
    } else {
        if (typeof handle[pathname] === 'function') {
            handle[pathname](response, request);
        } else {
            console.log("No request handler found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write("No route registered for " + pathname);
            response.end();
        }
    }

}

exports.route = route;