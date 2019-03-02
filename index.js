const fs = require('fs');
const http = require('http');
const siftlib = require('./siftlib');
const path = require('path');
//render process will remain at localhost:8080 until electron can be used
http.createServer((req,res) => {
    if (path.basename(req.url).indexOf('.') !== -1) {
        fs.readFile(req.url, (err, pagedata) => {
            if(err) {
                if(err.code == 'ENOENT') {
                    //404
                    fs.readFile(path.join(__dirname, 'Public', '404.html'), (err, pagedata) => {
                        res.writeHead(200, { 'Content-Type' : 'text/html' });
                        res.end(pagedata, 'utf8');
                    })
                } else {
                    //it's a server error.
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type' : siftlib.setContentType(req.url) });
                res.end(pagedata);
            }

        });
    } else {
        res.end(siftlib.getFolderContents(req.url));
    }
}).listen(8080);

