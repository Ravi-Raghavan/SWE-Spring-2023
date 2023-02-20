const http = require("http")
const fs = require("fs");
const url = require("url");

var paypal = require("./paypal.js");

const server = http.createServer((req, res) => {
    let reqUrl = url.parse(req.url).pathname == "/" ? "index.html" : url.parse(req.url).pathname;
    let captureUrl = reqUrl.match(/^\/api\/orders\/([^\/]+)\/capture$/);

    if (reqUrl === "/api/orders" && req.method == "POST") {
        paypal.createOrder()
            .then(order => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(order));
            })
            .catch(error => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.end(`Error creating order: ${error}`);
            });
    } else if (captureUrl != null && reqUrl === captureUrl[0] && req.method == "POST") {
        const orderId = captureUrl[1];
        console.log(orderId);
        paypal.capturePayment(orderId)
            .then(data => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
            })
            .catch(error => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.end(`Error creating order: ${error}`);
            });
    } else {
        fs.readFile(`./public/${reqUrl}`, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end(err.message);
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    }
});

var port = 3000;
server.listen(port, function() {
    console.log(`Server listening on port ${port} http://localhost:3000`)
});
