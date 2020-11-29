let http = require('http')
let fs = require('fs')
let unzipper = require('unzipper')
let queryString = require('querystring')

// auth 路由
/**
 *
 * @param {IncomingMessage} req
 * @param {*} res
 */
function auth(req, res) {
    let query = queryString.parse(req.url)
    console.log(query);
}

http.createServer(
    (req, res) => {
        console.log(req.headers);
        if (req.url.includes('/auth')) {
            auth(req, res);
        }
        //



        // const outFile = fs.createWriteStream('./public/build.zip')
        // req.pipe(outFile);
        // req.pipe(unzipper.Extract({ path: './public/build/' })).on('error', () => {
        //     console.log("error");
        // })

        // const outFile = fs.createWriteStream('./public/index.html')
        // req.on('data', (chunk) => {
        //     console.log(chunk.toString());
        //     outFile.write(chunk);
        // })

        // req.on('end', () => {
        //     // outFile.end()
        //     console.log("end");
        //     res.writeHead(200, { "content-type": "text/html" });
        //     res.end('success')
        // })

        // outFile.on('error', function (err) {
        //     console.log(err);
        // });

    }
).listen(8082)