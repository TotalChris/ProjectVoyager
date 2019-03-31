/*const path = require('path');*/
const { shell } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
var hindex = 0;
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
        return hist[hindex]
}
function goForth(){
    if((hindex + 1) < hist.length){
        hindex++
    }
        return hist[hindex]
}
function createDirContent(directoryName) { 
    if(directoryName !== '/favicon.ico'){
    files = fs.readdirSync(directoryName, { 'encoding': 'utf8', 'withFileTypes': true });
        var filesout = ``;
        var foldersout = ``;
        files.forEach((element) => {
                if (element.isDirectory()) {
                foldersout += (`<tr><td type="folder" elementname="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='./bin/img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='./bin/img/fld.png'}"><img src="./bin/img/fld.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemNameText" onclick="selectItem(this.parentElement, 1)" ondblclick="render(siftlib.sift(pathString + '${element.name}', 1))">${element.name}/</div></td></tr>`)
                } else {
                filesout += (`<tr><td type="file" elementname="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='./bin/img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='./bin/img/fil.png'}"><img src="./bin/img/fil.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemNameText" onclick="selectItem(this.parentElement, 1)" ondblclick="render(siftlib.sift(pathString + '${element.name}', 1))">${element.name}</div></td></tr>`)
                }
            })
        };
        return foldersout + filesout
    }
function popCMenu(evt, pathString){
    //USE THE STYLING OF THE FILE TABLE FOR THIS FUNCTION
    return `
        <tr><td class="item" onclick="siftlib.openItems('${pathString}', Object.entries(document.getElementsByClassName('select')))"><img src="./bin/img/opn.png"><div class="itemNameText">Open</div></td></tr>
    `
}
function openItems(pathString, items){
    items.forEach((item) => {
        if (item[1].attributes.type.value === 'file'){
            shell.openItem(pathString + item[1].attributes.elementname.value);
        } else {
            goTo(pathString + item[1].attributes.elementname.value, 1)
        }
    });
};
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
module.exports = { createDirContent, sift, goBack, goForth, popCMenu, openItems }
