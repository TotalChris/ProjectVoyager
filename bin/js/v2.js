window.$ = window.jquery = require('jquery');
const win = require('electron').remote.getCurrentWindow();

//Theme change handler function
function init(){
    $('#menupanel').css('style', 'none')
    setTheme();
    ipcRenderer.send('gth');
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
        listItem = closestItems[0];
        if(!$(listItem).hasClass('select')){  //and and the element isn't selected at the moment,
            if($(evt.target).hasClass('itemNameText')){ //and if the text of the element was right-clicked,
                selectItem(listItem, 1);  //go ahead and select it, and clear out the other selected elements.
            } else { //But, if the click happened outside the item's text,
                selectItem(document.getElementById('cd'), 1) //select the cd element, representing the entire folder, and clear the others.
            }
        } //But, in the case of the element's state, if it was already selected, we can just do nothing because the user wants to select what's already been chosen
        $('#context-table').html(siftlib.popCMenu(evt)) //since we know we have items being selected, we can now populate/draw the context menu
    }//now just position and show it
    cmenu.style.left = evt.clientX - (evt.clientX > (window.innerWidth - 150) ? 150 : 0);
    cmenu.style.top = evt.clientY - (evt.clientY > (window.innerHeight - 210) ? 210 : 0);
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
    Object.entries($('.select')).forEach((entry, i) => {
        if (i < l){
            console.log(i)
            $(entry).removeClass('select');
            $(entry).children('div.topbtn').children('img').attr('src', `../img/${entry[1].attributes.type.value === "file" ? 'fil' : 'fld'}.png`);
        } else {
            return
        }
    });
}

//deselect all

function selectItem(item, slflag){
    $(item).children('div.topbtn').children('img').attr('src', `../img/${$(item).hasClass('select')? 'chk0' : 'chk1'}.png`);
    selected = $('.select');
    if (slflag === 1){
        deselectAll();
    }
    $(item).toggleClass('select', '')
    siftlib.popPMenu($('.select')[0].id === 'cd' ? true : false);
}

//ipcRenderer goto handler

ipcRenderer.on('goto', (e, loc) => {
    goTo(loc, 1);
})

