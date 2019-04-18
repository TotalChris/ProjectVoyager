const os = require('os');
const path = require('path');
const { ipcRenderer, shell } = require('electron');
const win = require('electron').remote.getCurrentWindow();
const siftlib = require('../js/siftlib');
const panel = document.getElementById('menupanel');
const fs = require('fs');
var home = os.homedir().replace(/\\/g, '/');
var pathString = home;
var maxflag = 0;
var thmflag = false;
panel.style.display = 'none'

var body = document.body;
var filelist = document.getElementById('filelist');
var cmenu = document.getElementById('context');

function init(){
    applyTheme(false);
    ipcRenderer.send('gth');
}
ipcRenderer.on('goto', (evt, loc) => {
    console.log(loc)
    goTo(loc, 1);
})
function applyTheme(val){
    var args = { 'src': '' , 'text': '' }
    if (val !== null){
        thmflag = val;
    }
    if (thmflag === false){
        body.classList.remove('light');
        body.classList.add('dark');
        args.src = '../img/lgt.png';
        args.text = 'Light Mode';
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        args.src = '../img/drk.png';
        args.text = 'Dark Mode';
    }
    document.getElementById('themeswitch').children[0].children[0].src = args.src;
    document.getElementById('themeswitch').children[1].innerHTML = args.text;
}
document.getElementById('themeswitch').addEventListener('click', () => {applyTheme(!thmflag);});
window.addEventListener("click", (evt) => {
    evt.preventDefault();
    if(cmenu.classList.contains('show')){
        cmenu.classList.remove('show');
        filelist.classList.add('hover-enabled');
    }
});
document.addEventListener('contextmenu', (evt) => {
    if (evt.target.parentElement.classList.contains('item') || evt.target.parentElement.parentElement.classList.contains('item')){ //if our target is an item,
        if(!evt.target.parentElement.parentElement.classList.contains('select') && !evt.target.parentElement.classList.contains('select')){  //and and the element isn't selected at the moment,
            if(evt.target.classList.contains('itemNameText')){ //and if the text of the element was right-clicked,
                selectItem(evt.target.parentElement.parentElement, 1);  //go ahead and select it, and clear out the other selected elements.
            } else { //But, if the click happened outside the item's text,
                selectItem(document.getElementById('cd'), 1) //select the cd element, representing the entire folder, and clear the others.
            }
        } //But, in the case of the element's state, if it was already selected, we can just do nothing because the user wants to select what's already been chosen
        cmenu.children[0].innerHTML = siftlib.popCMenu(evt, pathString) //since we know we have items being selected, we can now populate the context menu
    }//now just draw and show it
    cmenu.style.top = evt.clientY;
    cmenu.style.left = evt.clientX;
    filelist.classList.remove('hover-enabled');
    cmenu.classList.add('show');
})

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

function selectItem(item, slflag){
    selected = document.getElementsByClassName('select');
    if(item.classList.contains('select') && slflag === 0){
        //if the flag is zero, we are trying to toggle the checkbox
        item.classList.remove('select');
        item.children[0].children[0].src='../img/chk0.png';
    } else {
        //if the flag is 1, we want to deselect all other currently selected elements
        if (slflag === 1){
            Object.entries(selected).forEach((entry) => {
            entry[1].classList.remove('select');
                if(entry[1].attributes.type.value === "folder"){
                        entry[1].children[0].children[0].src='../img/fld.png';
                }
                if(entry[1].attributes.type.value === "file"){
                        entry[1].children[0].children[0].src='../img/fil.png';
                }
            });
        }
        item.children[0].children[0].src='../img/chk1.png';
        item.classList.add('select');
    }
}

function render(args){
    if (args.type === 'folder'){
        document.getElementById('filelist').innerHTML = args.pagedata;
        pathString = args.pathString;
        document.getElementById('pathbox').value = args.pathString;
    } else {
        console.log(args.pathString);
        shell.openItem(args.pathString);
    }
}

function textFieldKeyHandler(event) {
    if (event.key === 'Enter') {
        goTo(document.getElementById('pathbox').value, 1);
    } else {

    }
};

function goTo(newPathString, navflag) {

    //error handle locally
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
win.on('closed', () => {
    win = null;
})
win.on('maximize', (evt) => {
    document.getElementById('rsz_btn').innerHTML='<img src="../img/res.png"/>';
})
win.on('resize', (evt) => {
    if (win.isMaximized() === false) {
        document.getElementById('rsz_btn').innerHTML='<img src="../img/max.png"/>';
    }
})
function resizeWin(){
    if (maxflag === 0) {
        maxflag = 1;
        win.maximize();
    } else {
        maxflag = 0;
        win.restore();
    }
}