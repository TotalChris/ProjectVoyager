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
        foldersout += (`<tr><td type="folder" id="cd" class="item" id="cd"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fld.png'}"><img src="../img/fld.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="render(siftlib.sift(pathString + '/', 1))"><div class="itemNameText">/</div></div></td></tr>`)
        files.forEach((element) => {
                if (element.isDirectory()) {
                foldersout += (`<tr><td type="folder" id="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fld.png'}"><img src="../img/fld.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="goTo(pathString + '${element.name}', 1)"><div class="itemNameText">${element.name}</div></div></td></tr>`)
                } else {
                filesout += (`<tr><td type="file" id="${element.name}" class="item"><div class="topbtn" onmouseover="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/chk0.png';};" onmouseout="if(!this.parentElement.classList.contains('select')){this.children[0].src='../img/fil.png'}"><img src="../img/fil.png" onclick="selectItem(this.parentElement.parentElement, 0)"/></div><div class="itemRow" onclick="selectItem(this.parentElement, 1)" ondblclick="goTo(pathString + '${element.name}', 1)"><div class="itemNameText">${element.name}</div></div></td></tr>`)
                }
            })
        };
        return foldersout + filesout
    }
function popCMenu(evt){
    if (document.getElementById('cd').classList.contains('select')){
        return `
        <table class="itemlist hover-enabled">
            <tr><td class="context-item" onclick="siftlib.openItems(pathString, Object.entries(document.getElementsByClassName('select')))"><img src="../img/opn.png"><div class="itemRow">New Window</div></td></tr>
            <tr><td class="context-item disable" onclick=""><img src="../img/cut.png"><div class="itemRow">Cut</div></td></tr>
            <tr><td class="context-item disable" onclick=""><img src="../img/cop.png"><div class="itemRow">Copy</div></td></tr>
            <tr><td class="context-item" onclick="siftlib.dumpItems(pathString)"><img src="../img/pst.png"><div class="itemRow">Paste</div></td></tr>
            <tr><td class="context-item disable" onclick="" id="ren"><img src="../img/edt.png"><div class="itemRow">Rename</div></td></tr>
            <tr><td class="context-item disable" onclick=""><img src="../img/dlt.png"><div class="itemRow ">Delete</div></td></tr>
        </table>`
    }
    //USE THE STYLING OF THE FILE TABLE FOR THIS FUNCTION
    return `
    <table class="itemlist hover-enabled">
        <tr><td class="context-item" onclick="siftlib.openItems(pathString, Object.entries(document.getElementsByClassName('select')))"><img src="../img/opn.png"><div class="itemRow">Open</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 1)"><img src="../img/cut.png"><div class="itemRow">Cut</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 0)"><img src="../img/cop.png"><div class="itemRow">Copy</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.dumpItems(pathString)"><img src="../img/pst.png"><div class="itemRow">Paste</div></td></tr>
        <tr><td class="context-item" onclick="renameItem('${evt.target.parentElement.parentElement.id}')" id="ren"><img src="../img/edt.png"><div class="itemRow">Rename</div></td></tr>
        <tr><td class="context-item" onclick="siftlib.deleteItems(pathString, Object.entries(document.getElementsByClassName('select')))"><img src="../img/dlt.png"><div class="itemRow ">Delete</div></td></tr>

    </table>
    `
}
function popPMenu(iscd){
    if (iscd) {
        return `
        <div id="nWPanelButton" class="panelItem" onclick="siftlib.openItems(pathString, Object.entries(document.getElementsByClassName('select')))">
            <div class="panelItemSubject"><img src="../img/opn96.png"></div>
            <div class="panelItemText">New Window</div>
        </div>
        <div id="pastePanelButton" class="panelItem" onclick="siftlib.dumpItems(pathString)">
            <div class="panelItemSubject"><img src="../img/pst96.png"></div>
            <div class="panelItemText">Paste</div>
        </div>
        ${document.getElementById('themeswitch').outerHTML}
        `
    } else {
        return `
        <div id="nWPanelButton" class="panelItem" onclick="siftlib.openItems(pathString, Object.entries(document.getElementsByClassName('select')))">
            <div class="panelItemSubject"><img src="../img/opn96.png"></div>
            <div class="panelItemText">Open</div>
        </div>
        <div id="cutPanelButton" class="panelItem" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 1)">
            <div class="panelItemSubject"><img src="../img/cut96.png"></div>
            <div class="panelItemText">Cut</div>
        </div>
        <div id="copyPanelButton" class="panelItem" onclick="siftlib.addItems(pathString, Object.entries(document.getElementsByClassName('select')), 0)">
            <div class="panelItemSubject"><img src="../img/cop96.png"></div>
            <div class="panelItemText">Copy</div>
        </div>
        <div id="pastePanelButton" class="panelItem" onclick="siftlib.dumpItems(pathString)">
            <div class="panelItemSubject"><img src="../img/pst96.png"></div>
            <div class="panelItemText">Paste</div>
        </div>
        <div id="delPanelButton" class="panelItem" onclick="siftlib.deleteItems(pathString, Object.entries(document.getElementsByClassName('select')))">
            <div class="panelItemSubject"><img src="../img/del96.png"></div>
            <div class="panelItemText">Delete</div>
        </div>
        ${document.getElementById('themeswitch').outerHTML}
        `
    }
}
function clearPMenu(){
    document.getElementById('menupanel').innerHTML = document.getElementById('themeswitch').outerHTML;
}
function openItems(pathString, items){
    items.forEach((item) => {
        if (item[1].attributes.type.value === 'file'){
            shell.openItem(pathString + item[1].id);
        } else {
            newWindow(pathString + item[1].id, 1);
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
        clipboard[cindex] = { 'path': pathString + item[1].id, 'cutflag': cutflag };
        console.log(clipboard);
    })
}
function dumpItems(pathString){
    Object.entries(clipboard).forEach((entry) => {
            copyItem(entry[1].path, pathString, () => {
                if(entry[1].cutflag === 1){
                    destroy(entry[1].path);   
                }
            });
    });
}
/* function deleteItems(pathString, items){
    items.forEach((item) => {
        if(item[1].attributes.type.value === 'file'){
            fs.unlink(pathString + item[1].id, (err) => {
                if (err) throw err;
            });
        } else {
            destroy(pathString + item[1].id);
        }
    });
}; */

function deleteItems(pathString, items){
    items.forEach((item) => {
        destroy(pathString + item[1].id)
    });
};

function copyItem(source, target, callback) {
    console.log(`Begin copy of ${source} to ${target}`)
    var files = [];
    //check if folder needs to be created or integrated
    console.log('source: '+path.basename(path.normalize(source + '/..')))
    console.log('target: '+path.basename(target))
    var targetFolder = path.join(target, path.basename(source));
    while (fs.existsSync(targetFolder)){
        targetFolder += (fs.existsSync(path.join(target, path.basename(source))) && path.basename(target) === path.basename(path.normalize(source + '/..')) ? ' - Copy' : '') + (fs.existsSync(path.join(target, path.basename(source))) && path.basename(target) !== path.basename(path.normalize(source + '/..')) ? ' - from ' + path.basename(path.normalize(source + '/..')) : '' );
        console.log(targetFolder)
    }
    if (!fs.existsSync(targetFolder) && fs.lstatSync(source).isDirectory()) {
        fs.mkdirSync(targetFolder);
    }
    //copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach((file) => {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyItem(curSource, targetFolder, () => {});
            } else {
                console.log(`Copying ${curSource} to ${targetFolder + '/' + file}`)
                fs.copyFileSync(curSource, targetFolder + '/' + file, fs.constants.COPYFILE_EXCL);
            }
        });
    } else {
        fs.copyFileSync(source, targetFolder, fs.constants.COPYFILE_EXCL);
    }
    callback();
}

function destroy(itemPath){
    if(fs.existsSync(itemPath) && fs.lstatSync(itemPath).isDirectory()) {
        files = fs.readdirSync(itemPath)
        Promise.all(files.map((file) => {
            var absPath = itemPath + "/" + file;
            if(fs.lstatSync(absPath).isDirectory()){
                destroy(absPath);
            } else { 
                fs.unlinkSync(absPath);
            }
        })).then(fs.rmdirSync(itemPath))
    } else {
        fs.unlinkSync(itemPath);
    };
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
module.exports = { createDirContent, sift, goBack, goForth, popCMenu, openItems, addItems, hist, dumpItems, deleteItems, popPMenu, clearPMenu }
