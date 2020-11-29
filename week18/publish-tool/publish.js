let http = require('http')
let fs = require('fs');
let archiver = require('archiver')

let child_process = require("child_process")


// open https://github.com/login/oauth/authorize?client_id= Iv1.fae9105c0e565b1a

child_process.exec("start https://github.com/login/oauth/authorize?client_id=Iv1.fae9105c0e565b1a")
// http.createServer((req, res) => {

// })

// const archive = archiver('zip', {
//     zlib: { level: 9 }
// });

// archive.directory('dist/', false);
// // archive.pipe(fs.createWriteStream("build.zip"));





// let request = http.request(
//     {
//         hostname: '127.0.0.1',
//         port: 8082,
//         method: 'post',
//         headers: {
//             'Content-Type': 'application/octet-stream',
//             // 'Content-Length': 1235
//             'Transfer-Encoding': 'chunked'
//         }
//     }, res => {
//         console.log(res.statusCode);
//         res.on("data", (chunk) => {
//             console.log(chunk.toString());
//         })

//         res.on("error", (chunk) => {
//             console.log(chunk.toString());
//         })

//     }
// );

// // let file = fs.createReadStream("build.zip");
// archive.pipe(request);
// request.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
// });

// archive.on('end', () => {
//     request.end();
// })
// archive.finalize();
//     // fs.stat("build.zip", (error, stat) => {

//     // });




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