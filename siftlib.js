const path = require('path');
const fs = require('fs');

function getFolderContents(directoryName) { 
    //gets an array list of folder contents in the given subfolder and makes code to display it
    //'cd' must be predefined as the user's active directory. Make SURE it is declared before running.
    if(directoryName !== '/favicon.ico'){
    filelist = fs.readdirSync(directoryName, 'utf8');
        var filesout = ``;
        var foldersout = ``;
        filelist.forEach((element) => {
            if (element.indexOf('.') === -1) {
            foldersout += (`<a href="./${element}/">${element}/</a><br>`)
            } else {
            filesout += (`<a href="${element}">${element}</a><br>`)
            }
        });
        return foldersout + filesout
    } else {

    }
}
function setContentType(filePath){
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
}
module.exports = { getFolderContents , setContentType }
