var fs = require("fs");

function home (response){
    console.log("Request handler 'home' was called.");

    var content = fs.readFileSync("./dist/views/index.html");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
//    response.end();
}

function details (response){
    console.log("Request handler 'details' was called.");
    var content = fs.readFileSync("./dist/views/details.html");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();
}

exports.home = home;
exports.details = details;


