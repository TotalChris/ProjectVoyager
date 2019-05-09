window.$ = window.jquery = require('jquery');
const win = require('electron').remote.getCurrentWindow();
const { ipcRenderer, shell } = require('electron');
const os = require('os');
const path = require('path');
const siftlib = require('../js/siftlib');
const fs = require('fs');
var home = os.homedir().replace(/\\/g, '/');
const remote = require('electron').remote
var pathString = home;
var hindex = -1;
var hist = [];

//Theme change handler function and init
function init(){
    $('#menupanel').css('style', 'none')
    setTheme();
    goTo((remote.process.argv[2] != null ? remote.process.argv[2] : home), 1);
}
function setTheme(){
    $('body').toggleClass('dark', 'light')
    $('#themeswitch div.panelItemSubject img').attr('src', () => {
        return '../img/' + ($('body').hasClass('dark') ? 'lgt' : 'drk') + '.png'
    })
    $('#themeswitch div.panelItemText').html(($('body').hasClass('dark') ? 'Light' : 'Dark') + ' Mode')
}

//Window resizing handlers

win.on('closed', () => {
    win = null;
})

win.on('resize', () => {
    if (win.isMaximized() === false) {
        $('#rsz_btn img').attr('src', '../img/max.png');
    }
})

function resizeWin(){
    if (win.isMaximized() === false) {
        win.maximize();
        $('#rsz_btn img').attr('src', '../img/res.png');
    } else {
        win.restore();
    }
}

//Context menu event handler

$(document).contextmenu((evt) => {
    closestItems = $(evt.target).closest('td.item');
    if (closestItems.length !== 0){ //if our target is an item,
        iscd = false;
        listItem = closestItems[0];
        if(!$(listItem).hasClass('select')){  //and and the element isn't selected at the moment,
            if($(evt.target).hasClass('itemNameText')){ //and if the text of the element was right-clicked,
                selectItem(listItem, 1);  //go ahead and select it, and clear out the other selected elements.
            } else { //But, if the click happened outside the item's text,
                deselectAll();
                iscd = true;
            }
        } //But, in the case of the element's state, if it was already selected, we can just do nothing because the user wants to select what's already been chosen
        $('#context-table').html(siftlib.popCMenu(evt, iscd)) //since we know we have items being selected, we can now populate/draw the context menu
    }//now just position and show it
    $('#context').css('left', evt.clientX - (evt.clientX > (window.innerWidth - 150) ? 150 : 0));
    $('#context').css('top', evt.clientY - (evt.clientY > (window.innerWidth - 210) ? 210 : 0));
    $('#filelist').removeClass('hover-enabled');
    $('#context').addClass('show');
})

//Window blur and click event handlers

$(window).blur((e) => resetContext(e))
$(window).click((e) => resetContext(e))

//global interaction reset (for blur and click)

function resetContext(evt){
    if($('#context').hasClass('show')){
        $('#context').removeClass('show');
        if (!($(evt.target).parent().id === 'ren')){
            $('#filelist').addClass('hover-enabled')
        };
        siftlib.clearPMenu();
    }
}

//deselect all currently selected elements

function deselectAll(){
    l = $('.select').length;
    if (l === 0){
        siftlib.popPMenu(true);
        return;
    } else {
        Object.entries($('.select')).forEach((entry, i) => {
            if (i < l){
                $(entry).removeClass('select');
                $(entry).children('div.topbtn').children('img').attr('src', `../img/${entry[1].attributes.type.value === "file" ? 'fil' : 'fld'}.png`);
            } else {
                return
            }
        });
    }
}

//deselect all

function selectItem(item, slflag){
    $(item).children('div.topbtn').children('img').attr('src', `../img/${$(item).hasClass('select')? 'chk0' : 'chk1'}.png`);
    selected = $('.select');
    if (slflag === 1){
        deselectAll();
    }
    $(item).toggleClass('select', '')
    siftlib.popPMenu($('.select').length === 0 ? true : false);
}

//ipcRenderer goto handler

ipcRenderer.on('goto', (e, loc) => {
    goTo(loc, 1);
})

//back and forth

function goBack(){
    hindex -= (hindex > 0 ? 1 : 0)
    return hist[hindex]
}
function goForth(){
    hindex += ((hindex + 1) < hist.length ? 1 : 0)
    return hist[hindex]
}

//menu panel toggle

function menuPanel(){
    $('#menupanel').toggle();
    $('#content-box-holder').css('height', `Calc(100% - ${$('#menupanel').css('display') === 'none' ? 70 : 175}px)`);
}

//render function (TODO replace)

function render(args){

}

//rename initialization

function renameItem(itemName){
    deselectAll();
    $('#filelist').removeClass('hover-enabled');
    $(`#${itemName} div.itemNameText`).html(`<input type="text" id="renbox" onkeydown="textFieldKeyHandler(event)" autofocus="autofocus"></input>`);
    $('#renbox').val($('#renbox').closest('td.item').attr('id'));
    $('#renbox').blur((evt) => {renameSubmit(evt)})
    $('#renbox').keypress((evt) => {if(evt.key === 'Enter'){renameSubmit(evt)}})

}

function renameSubmit(evt){
    if($('#renbox').closest('td.item').attr('id') !== evt.target.value){
        fs.rename(pathString + $('#renbox').closest('td.item').attr('id'), pathString + evt.target.value, (err) => {
            if (err) throw err;
        })
    }
    $('#renbox').parent().html(`<div class="itemNameText">${evt.target.value}</div>`)
    $('#filelist').addClass('hover-enabled');
}

//textbox key handler

function textFieldKeyHandler(event) {
    if (event.key === 'Enter' && event.target.id === 'pathbox') {
        goTo(event.target.value, 1);
    }
};

function goTo(newPathString, navflag) { //NO-jquery
    //error handle locally
    siftlib.clearPMenu();
    fs.stat(newPathString, '', (err) => {
        if (err) {
            //what's the issue?
            switch (err.code) {
                case ('EPERM'): {
                    console.log('Your system restricts "' + newPathString + '".');
                    break;
                }
                case ('ENOENT'): {
                    console.log(newPathString + ' does not exist in the current filesystem.');
                    break;
                }
                case ('EACCES'): {
                    console.log('You do not have the account permissions to access "' + newPathString + '".');
                    break;
                }
                default: {
                    console.log('Whoops! I got something wrong, here. Try that again.')
                    break;
                }
            }
        } else {
            //if everything is okay...
            args = siftlib.sift(newPathString, navflag);
            if (navflag == 1){
                if (((hindex + 1) !== hist.length) && (hist[hindex] !== pathString)){hist.length = hindex + 1}
                hindex++
                hist[hindex] = newPathString;
            }
            if (args.type === 'folder'){
                $('#filelist').html(siftlib.createDirContent(newPathString));
                pathString = args.pathString;
                $('#pathbox').val(args.pathString);
                $('#content-box-holder').scrollTop(0);
            } else {
                shell.openItem(args.pathString);
            }
            if (pathString !== newPathString){ //if we have a new path rendered
                fs.unwatchFile(pathString); //unwatch all the old paths
                fs.watch(newPathString, () => { //watch the new directory
                    goTo(pathString); //refresh if we detect anything
                })
            }
            
        }
    })
};