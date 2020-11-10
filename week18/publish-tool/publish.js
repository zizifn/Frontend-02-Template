let http = require('http')
let fs = require('fs');
const { post } = require('../server/routes');


let request = http.request(
    {
        hostname: '127.0.0.1',
        port: 8082,
        method: 'post',
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }, res => {
        console.log(res);
    }
);

let file = fs.createReadStream("./index.html");

file.pipe(request);
// let file = fs.createReadStream("./index.html");
// // 如果文件过大，event 'data'， 会调用多次
// // let file = fs.createReadStream(".pdf");

// file.on('data', chunk => {
//     // console.log(chunk.toString());
//     request.write(chunk);
// })

// file.on('end', () => {
//     console.log('end finshed');
//     request.end();
// })

// // request.end();