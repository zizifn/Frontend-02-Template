let http = require('http')

let request = http.request(
    {
        hostname: '127.0.0.1',
        port: 8082
    }, res => {
        console.log(res);
    }
);

request.end();