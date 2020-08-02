const net = require('net');
const os = require('os');
const parser = require('./htmlParser')
const images = require('images');
const render = require('./render');

class Request {
    constructor(options) {
        this.method = options.method || 'GET',
            this.host = options.host;
        this.port = options.port;
        this.path = options.path || '/';
        this.body = options.body;
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(
                key => `${key} = ${encodeURIComponent(this.body[key])}`
            ).join('&');
        }
        this.headers['Content-Length'] = this.bodyText.length;
    }
    send(connection) {
        return new Promise(
            (resolve, reject) => {
                const parser = new ResponseParser;
                if (connection) {
                    connection.write(this.toString());
                } else {
                    connection = net.createConnection(
                        {
                            host: this.host,
                            port: this.port
                        }, () => {
                            connection.write(this.toString())
                        });
                }

                connection.on('data', (data) => {
                    // console.log(data.toString());

                    // 传给parser
                    parser.receive(data.toString());
                    if (parser.isFinished) {
                        resolve(parser.response);
                        connection.end()
                    }
                }
                );

                connection.on('error', (err) => {
                    reject(err);
                    connection.end();
                })

            });
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join(os.EOL)}

${this.bodyText}`;
    }
}

class ResponseParser {

    constructor(
    ) {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;

        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;

    }
    receive(str) {
        for (let i = 0; i < str.length; i++) {
            this.receiveChar(str[i]);
        }
        // console.log(this.headers)
    }

    get isFinished() {
        return this.bodyParser.isFinished;
    }
    get response() {
        return {
            statusCode: this.statusLine.slice(9, 12),
            statusText: this.statusLine.slice(12).trim(),
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    // HTTP/1.1 200 Fiddler Generated
    // Date: Sun, 26 Jul 2020 11:24:35 GMT
    // Content-Type: text/html; charset=UTF-8
    // Connection: close
    // Cache-Control: no-cache, must-revalidate
    // Timestamp: 19:24:35.790
    // Content-Length: 1437
    // Transfer-Encoding: chunked

    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE
            } else if (char === '\r') {
                // 最后一个header，会有一个\r\n，
                // 但是我感觉这里有点异常没有处理，万一header没有:呢？
                this.current = this.WAITING_HEADER_BLOCK_END;
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            // body 前的一个\r\n
            if (char === '\n') {
                this.current = this.WAITING_BODY;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
            }
        } else if (this.current === this.WAITING_BODY) {
            // this._isFinished = true;
            // // console.log(char);
            this.bodyParser.receiveChar(char);
        }

    }

}


class TrunkedBodyParser {

    constructor(
    ) {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;

    }

    // HTTP/1.1 200 Fiddler Generated
    // Date: Sun, 26 Jul 2020 11:24:35 GMT
    // Content-Type: text/html; charset=UTF-8
    // Connection: close
    // Cache-Control: no-cache, must-revalidate
    // Timestamp: 19:24:35.790
    // Content-Length: 1437
    // Transfer-Encoding: chunked

    // 59
    // <!doctype html>
    // <html><head><meta http-equiv="Content-Type" content="text/html; charset=U
    // 59
    // TF-8"><title>Fiddler Echo Service</title></head><body style="font-family: arial,sans-seri
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            //遇到换行，说明已经读取到了length
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            // 处理 \r\n
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            // 处理 http最后的\r\n
            if (this.length === 0 && char === '\r') {
                this.current = this.WAITING_NEW_LINE;
            } else {
                this.content.push(char);
                this.length = this.length - 1;
                if (this.length === 0) {
                    this.current = this.WAITING_NEW_LINE;
                }
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char == '\r') {
                this.current = this.WAITING_NEW_LINE_END
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                // next length
                this.current = this.WAITING_LENGTH;
            }
        }

    }

}

void async function () {

    let request = new Request(
        {
            method: 'POST',
            host: '127.0.0.1',
            port: 3000,
            path: '/',
            headers: {
                "X-Foo2": "customed"
            },
            body: {
                name: "james"
            }
        }
    )

    let response = await request.send();

    let dom = parser.parseHTML(response.body)
    let viewport = images(1200, 1200);

    //  <div class="c1" />
    render(viewport, dom);

    viewport.save("viewport.jpg")
    // console.log(JSON.stringify(dom, null, "     "));
}();