/*const path = require('path');*/
const electron = require('electron'); 
const fs = require('fs');
var hindex = 0
var hist = [];

function sift(pathString, navflag) {
    //navflag is set to 1 if moving using the filelist. This will log history and overwrite the previous entries
    //if set to 0, history will be ignored. Usuall this is used for library functions that modify the history directly.
    if (fs.statSync(pathString).isFile()) {
        fs.readFile(pathString, (err, pagedata) => {
            if (err) {
                throw err;
            } else {
                electron.shell.openItem(pathString)
            }
        });
    } else {
        if ((pathString.lastIndexOf('/')+1) !== pathString.length){pathString += '/'}; //correct path name if need-be
        if (navflag == 1){
            if ((hindex + 1) !== hist.length){hist.length = hindex + 1}
            hindex++
            hist[hindex] = pathString;
        }
        console.log({hist, hindex, navflag});
        return { 'pathString': pathString, 'pagedata': createDirContent(pathString), 'contentType': 'text/html' };
    }
}
function goBack(){
    if (hindex > 0){
        hindex--
        return sift(hist[hindex], 0);
    }
}

function goForth(){
    if((hindex + 1) < hist.length){
        hindex++
        return sift(hist[hindex], 0);
    }
}

function createDirContent(directoryName) { 
    if(directoryName !== '/favicon.ico'){
    filelist = fs.readdirSync(directoryName, { 'encoding': 'utf8', 'withFileTypes': true });
        var filesout = ``;
        var foldersout = ``;
        filelist.forEach((element) => {
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
module.exports = { createDirContent, sift, goBack, goForth }
