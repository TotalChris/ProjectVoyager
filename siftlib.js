/*const path = require('path');*/
const fs = require('fs');

function sift(directoryName) { 
    if(directoryName !== '/favicon.ico'){
    filelist = fs.readdirSync(directoryName, { 'encoding': 'utf8', 'withFileTypes': true });
        var filesout = ``;
        var foldersout = ``;
        filelist.forEach((element) => {
//TODO: Cannot get fs.stats on ANY locked folder or file. This will kill functionality on windows.
                if (element.isDirectory()) {
                foldersout += (`<tr><td onclick="goToFolder(path + '${element.name}/')">${element.name}/</td></tr>`)
                } else {
                filesout += (`<tr><td onclick="goToFolder(path + '${element.name}')">${element.name}</td></tr>`)
                }
            })
        };
        return foldersout + filesout
    }
/*function setContentType(filePath){
    if (path.basename(filePath).indexOf('.') !== -1) {
        let extname = path.extname(filePath);
        //find appropriate content type 
        switch(extname) {
            case '.json':
                contentType = 'application/json';
                break;
            case '.js':
                contentType = 'text/javascript'
                break;
            case '.css':
                contentType = 'text/css'
                break;
            case '.png':
                contentType = 'image/png'
                break;
            case '.jpg':
                contentType = 'image/jpg'
                break;
        };
    } else {
        contentType = 'text/html'
    }
    return contentType
}*/
module.exports = { sift }
