const fs = require('fs');
const http = require('http');
const siftlib = require('./siftlib');
const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron')
//render process will remain at localhost:8080 until electron can be used
function createWindow() {

let win = new BrowserWindow({ width: 1200, height: 1000, frame: false, webPreferences: { experimentalFeatures: true} })
//
    win.loadFile('voyager.html')
    win.on('closed', () => {
        win = null
    })
}
app.on('ready', createWindow)
ipcMain.on('getme', (evt, pathString) => {
    if (path.basename(pathString).indexOf('.') !== -1) {
        fs.readFile(pathString, (err, pagedata) => {
            if(err) {
                if(err.code == 'ENOENT') {
                    //404
                    fs.readFile(path.join(__dirname, 'Public', '404.html'), (err, pagedata) => {
                        evt.sender.send('igot', { 'pagedata': pagedata, 'contentType': 'text/html'})
                    })
                } else {
                    //it's a server error
                    console.log(`Server Error: ${err.code}`);
                }
            } else {
                shell.openItem(pathString)
            }

        });
    } else {
        evt.sender.send('igot', { 'pagedata': siftlib.getFolderContents(pathString), 'contentType': 'text/html' });
    }


})


/*function makeFileListHTML(pathString) {
    if (pathString.basename(pathString).indexOf('.') !== -1) {
        fs.readFile(pathString, (err, pagedata) => {
            if(err) {
                if(err.code == 'ENOENT') {
                    //404
                    fs.readFile(pathString.join(__dirname, 'Public', '404.html'), (err, pagedata) => {
                        //res.end(pagedata, 'utf8');
                    })
                } else {
                    //it's a server error.
                    //res.writeHead(500);
                    //res.end(`Server Error: ${err.code}`);
                }
            } else {
                //res.writeHead(200, { 'Content-Type' : siftlib.setContentType(pathString) });
                return ({ pagedata: pagedata ,  ;
            }

        });
    } else {
        ipcMain.send{ pagedata: siftlib.getFolderContents(pathString), contentType: 'text/html' };
    }
}*/