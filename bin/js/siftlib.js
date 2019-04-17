/*const path = require('path');*/
const { shell } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const child_proc = require('child_process');
var hindex = -1;
var hist = [];
var cindex = -1;
var clipboard = [];

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
        foldersout += (`<tr><td type="folder" elementname="/" class="item" id="cd"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fld.png'}"><img src="../img/fld.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="render(siftlib.sift(pathString + '/', 1))"><div class="itemNameText">/</div></div></td></tr>`)
        files.forEach((element) => {
                if (element.isDirectory()) {
                foldersout += (`<tr><td type="folder" elementname="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fld.png'}"><img src="../img/fld.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="goTo(pathString + '${element.name}', 1)"><div class="itemNameText">${element.name}/</div></div></td></tr>`)
                } else {
                filesout += (`<tr><td type="file" elementname="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fil.png'}"><img src="../img/fil.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="goTo(pathString + '${element.name}', 1)"><div class="itemNameText">${element.name}</div></div></td></tr>`)
                }
            })
        };
        return foldersout + filesout
    }
function popCMenu(evt, pathString){
    //USE THE STYLING OF THE FILE TABLE FOR THIS FUNCTION
    return `
    <table class="itemlist hover-enabled">
        <tr><td class="context-item" onclick="siftlib.openItems(pathString, Object.entries(document.getElementsByClassName('select')))"><img src="../img/opn.png"><div class="itemRow itemNameText">Open</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 1)"><img src="../img/cut.png"><div class="itemRow itemNameText">Cut</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 0)"><img src="../img/cop.png"><div class="itemRow itemNameText">Copy</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.dumpItems(pathString)"><img src="../img/pst.png"><div class="itemRow itemNameText">Paste</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.deleteItems(pathString, Object.entries(document.getElementsByClassName('select')))"><img src="../img/dlt.png"><div class="itemRow itemNameText">Delete</div></td></tr>

    </table>
    `
}
function openItems(pathString, items){
    items.forEach((item) => {
        if (item[1].attributes.type.value === 'file'){
            shell.openItem(pathString + item[1].attributes.elementname.value);
        } else {
            newWindow(pathString + item[1].attributes.elementname.value, 1);
        }
    });
};
function newWindow(pathString){
    child_proc.exec('electron ' + path.normalize(__dirname + "/../../") + ' "' + pathString + '"');
}
function addItems(pathString, items, cutflag){
    cindex = -1
    clipboard = []
    items.forEach((item) => {
        cindex = cindex + 1;
        clipboard[cindex] = { 'path': pathString + item[1].attributes.elementname.value, 'cutflag': cutflag };
    })
}
function dumpItems(pathString){
    Object.entries(clipboard).forEach((entry) => {
        fs.copyFile(entry[1].path, pathString + path.parse(entry[1].path).base, fs.constants.COPYFILE_EXCL, (err) => {
            if (err) throw err;
            if(entry[1].cutflag === 1){
                fs.unlink(entry[1].path, (err) => {
                    if (err) throw err;
                });    
            }
        });
    });
}
function deleteItems(pathString, items){
    items.forEach((item) => {
        fs.unlink(pathString + item[1].attributes.elementname.value, (err) => {
            if (err) throw err;
        });  
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
module.exports = { createDirContent, sift, goBack, goForth, popCMenu, openItems, addItems, hist, dumpItems, deleteItems }
