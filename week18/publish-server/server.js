let http = require('http')
let fs = require('fs')



http.createServer(
    (req, res) => {
        console.log(req.headers);
        const outFile = fs.createWriteStream('./public/index.html')
        req.pipe(outFile);

        // const outFile = fs.createWriteStream('./public/index.html')
        // req.on('data', (chunk) => {
        //     console.log(chunk.toString());
        //     outFile.write(chunk);
        // })

        // req.on('end', () => {
        //     outFile.end()
        //     res.end('success')
        // })

        req.on('end', () => {
            res.end('success')
        })


    }
).listen(8082)