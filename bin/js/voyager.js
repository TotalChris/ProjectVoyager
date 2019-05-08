window.$ = window.jquery = require('jquery');
const os = require('os');
const { ipcRenderer, shell } = require('electron');
const siftlib = require('../js/siftlib');
const panel = document.getElementById('menupanel');
const fs = require('fs');
var home = os.homedir().replace(/\\/g, '/');
var pathString = home;

var filelist = document.getElementById('filelist');
var cmenu = document.getElementById('context');

function renameItem(itemName){
    deselectAll();
    filelist.classList.remove('hover-enabled');
    document.getElementById(itemName).children[1].innerHTML = `<input type="text" id="renbox" onkeydown="textFieldKeyHandler(event)" autofocus="autofocus"></input>`;
    document.getElementById('renbox').addEventListener('blur', (evt) => {
        console.log(evt)
        RenameInternalsTemp(evt)
    })
    document.getElementById('renbox').value = document.getElementById('renbox').parentElement.parentElement.id;
}

function menuPanel(){
    var contentbox = document.getElementById('content-box-holder');
    if (panel.style.display === 'none'){
        panel.style.display = 'block';
        contentbox.style.height = 'Calc(100% - 175px)';
    } else {
        panel.style.display = 'none';
        contentbox.style.height = 'Calc(100% - 70px)';

    }
}

function render(args){
    if (args.type === 'folder'){
        document.getElementById('filelist').innerHTML = args.pagedata;
        pathString = args.pathString;
        document.getElementById('pathbox').value = args.pathString;
        document.getElementById('cd').scrollIntoView();
    } else {
        console.log(args.pathString);
        shell.openItem(args.pathString);
    }
}

function textFieldKeyHandler(event) {
    console.log(event.key)
    console.log(event.target.id)
    if (event.key === 'Enter' && event.target.id === 'pathbox') {
        goTo(event.target.value, 1);
    } else {
        if (event.target.id === 'renbox'){
            if (event.key === 'Enter'){
                RenameInternalsTemp(event);
            } else {
                //'tab for next' functionality placeholder
            }
        }
    }
};

function RenameInternalsTemp(event){
    if(!(event.target.parentElement.parentElement.id === event.target.value)){
        console.log('New file name given')
        fs.rename(pathString + event.target.parentElement.parentElement.id, pathString + event.target.value, (err) => {
            if (err) throw err;
        })
    } else {
        console.log('Old file name matches new one!')
    }
    event.target.parentElement.innerHTML = `<div class="itemNameText">${event.target.value}</div>`;
    filelist.classList.add('hover-enabled');
}

function goTo(newPathString, navflag) {

    //error handle locally
    siftlib.clearPMenu();
    var stats = fs.stat(newPathString, '', (err, stats) => {
        if (err) {
            console.log(err.code); 
            //what's the issue?
            switch (err.code) {
                case ('EPERM'): {
                    notify('Your system restricts "' + newPathString + '".');
                    break;
                }
                case ('ENOENT'): {
                    notify(newPathString + ' does not exist in the current filesystem.');
                    break;
                }
                case ('EACCES'): {
                    notify('You do not have the account permissions to access "' + newPathString + '".');
                    break;
                }
                default: {
                    notify('Whoops! I got something wrong, here. Try that again.')
                    break;
                }
            }
        } else {
            //if everything is okay...
            render(siftlib.sift(newPathString, navflag));
            if (pathString !== newPathString){ //if we have a new path rendered
                fs.unwatchFile(pathString); //unwatch all the old paths
                console.log("No longer watching " + pathString); //let the debugger know
                fs.watch(newPathString, (evt, file) => { //watch the new directory
                    goTo(pathString); //refresh if we detect anything
                })
                console.log("Watching " + newPathString); //let the user know where we're watching
            }
            
        }
    })
};
function notify(message){
    ipcRenderer.send('ntf', message);
}