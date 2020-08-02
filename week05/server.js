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
            response.end(`<html mtest=test>

            <head>
                <title>Main</title>
                <style>
                #container{
                    width: 500px;
                    height:300px;
                    display:flex;
                    background-color:reb(255,255,255);
                }
                #container #myId{
                    width: 200px;
                    height:100px;
                    background-color:rgb(255,0,0);
                }
                #container .c1{
                    flex:1;
                    background-color:rgb(0,255,0);
                }
                </style>
            </head>

            <body>
                <div id="container">
                    <div id="myId" />
                    <div class="c1" />
                </div>
                <br />
                <script>
                </script>
            </body>

            </html>
            `);
        })
    }
).listen(3000)

