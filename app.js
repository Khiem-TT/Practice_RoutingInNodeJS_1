let http = require('http');
let url = require('url');
let StringDecoder = require('string_decoder').StringDecoder;

let handlers = {};
handlers.sample = (data, callback) => {
    callback(406, {'name': 'sample handle'});
};
handlers.notFound = (data, callback) => {
    callback(404);
};
handlers.home = (data, callback) => {
    callback(200, 'home page');
};

let router = {
    'sample': handlers.sample,
    'home': handlers.home
};

let server = http.createServer((req, res) => {
    let parseUrl = url.parse(req.url, true);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    // console.log(trimPath);
    // res.end();
    req.on("data", data => {

    });
    req.on('end', end => {
        let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
        let data = {
            "trimPath": trimPath
        };

        chosenHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : {};
            let payLoadString = JSON.stringify(payload);
            res.writeHead(statusCode);
            res.end(payLoadString);
            console.log("status " + statusCode + " payload " + payload);
        });
    });
});

server.listen(8000, () => {
    console.log(`http://localhost:8000`);
});