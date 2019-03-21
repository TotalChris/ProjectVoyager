/*const path = require('path');*/
const electron = require('electron'); 
const fs = require('fs');
const os = require('os');
const path = require('path');
var hindex = 0
var hist = [os.homedir().replace(/\\/g, '/')];

function sift(pathString, navflag) {
    //navflag is set to 1 if moving using the filelist. This will log history and overwrite the previous entries
    //if set to 0, history will be ignored. Usuall this is used for library functions that modify the history directly.
    if (fs.statSync(pathString).isFile()) {
        return { 'pathString': pathString, 'pagedata': '', 'type': 'file' };
    } else {
        if ((pathString.lastIndexOf('/')+1) !== pathString.length){pathString += '/'}; //correct path name if need-be
        if (navflag == 1){
            if (((hindex + 1) !== hist.length) && (hist[hindex] !== pathString)){hist.length = hindex + 1}
            hindex++
            hist[hindex] = pathString;
        }
        return { 'pathString': pathString, 'pagedata': createDirContent(pathString), 'type': 'folder' };
    }
}
function goBack(){
    if (hindex > 0){
        hindex--
    }
        return sift(hist[hindex], 0);
}
function goForth(){
    if((hindex + 1) < hist.length){
        hindex++
    }
        return sift(hist[hindex], 0);
}
function goUp(pathString){
   return sift(path.parse(pathString).dir, 1)
}
function createDirContent(directoryName) { 
    if(directoryName !== '/favicon.ico'){
    filelist = fs.readdirSync(directoryName, { 'encoding': 'utf8', 'withFileTypes': true });
        var filesout = ``;
        var foldersout = ``;
        filelist.forEach((element) => {
                if (element.isDirectory()) {
                foldersout += (`<tr><td elementname="${element.name}" ondblclick="ipcRenderer.send('getme', pathString + '${element.name}', 1)" class="item"><img src="./bin/img/fld.png"/ onclick="selectItem(this.parentElement, 0)"><div class="itemNameText" onclick="selectItem(this.parentElement, 1)">${element.name}/</div></td></tr>`)
                } else {
                filesout += (`<tr><td elementname="${element.name}" ondblclick="ipcRenderer.send('getme', pathString + '${element.name}', 1)" class="item"><img src="./bin/img/fil.png"/ onclick="selectItem(this.parentElement, 0)"><div class="itemNameText" onclick="selectItem(this.parentElement, 1)">${element.name}</div></td></tr>`)
                }
            })
        };
        return foldersout + filesout
    }
function popCMenu(evt, pathString){
    
    //USE THE STYLING OF THE FILE TABLE FOR THIS FUNCTION
    relpath = evt.target.attributes.elementname.value
    var fullPath = pathString + relpath
    return `
        <tr><td onclick="ipcRenderer.send('opn', '${fullPath}')"><img src="./bin/img/opn.png">Open</td></tr>
    `
    
    
    

    //isfile and isdir checks
    
    //extract the file location from this info
    //populate a context menu based on that path
    //return the html
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
module.exports = { createDirContent, sift, goBack, goForth, goUp, popCMenu }
