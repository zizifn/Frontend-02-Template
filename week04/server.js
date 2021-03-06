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
            response.end(`<html>
            <head>
                <title>Main</title>
                <style>
                </style>
            </head>
            <body>
                <div class="area">
                    <div class="box rAF"></div>
                </div>
                <br/>
                <script>
                    function setNewArea() {
                        let el = document.createElement('div')
                        el.setAttribute('class', 'area')
                    }
                    setNewArea()
                </script>
            </body>
            </html>
            `);
        })
    }
).listen(3333)

