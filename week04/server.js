const http = require('http');


http.createServer(
    (request, response) => {
        let body = [];
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (data) => {
            body.push(data)
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            console.log('request body:', body);

            response.writeHead(200, { 'content-type': 'text/html; charset=UTF-8' });
            response.end(`hello word`);
        })
    }
).listen(3000)

