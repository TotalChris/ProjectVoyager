//modules const fs = require('fs');
const siftlib = require('./siftlib');
const { app, BrowserWindow, ipcMain, shell } = require('electron')
//functions
function createWindow() {
let win = new BrowserWindow({ nodeIntegration: true, icon: "./bin/img/app.png", width: 1200, height: 900, frame: false, transparent: true, vibrancy: 'ultra-dark', webPreferences: { experimentalFeatures: true } })
var maxflag = 0;
    win.loadFile('voyager.html')
    win.on('closed', () => {
        win = null;
    })
    win.on('maximize', (evt) => {
        evt.sender.send('maxd');
    })
    win.on('resize', (evt) => {
        if (win.isMaximized() === false) {
        evt.sender.send('resd');
        }
    })
    ipcMain.on('rsz', (evt) => {
        if (maxflag === 0) {
            maxflag = 1;
            win.maximize();
            evt.sender.send('maxd');
        } else {
            maxflag = 0;
            win.restore();
            evt.sender.send('resd');
        }
    })
    ipcMain.on('min', () => {
        win.minimize();
    })
    ipcMain.on('cls', () => {
        win.close();
    })
}

ipcMain.on('bck', (evt) => {
    evt.sender.send('igot', siftlib.goBack());
})
ipcMain.on('fwd', (evt) => {
    evt.sender.send('igot', siftlib.goForth());
})

app.on('ready', createWindow)

ipcMain.on('getme', (evt, pathString, navflag) => {
    evt.sender.send('igot', siftlib.sift(pathString, navflag))
})
//siftlib.sift(pathString, navflag)
ipcMain.on('up', (evt, pathString) => {
    evt.sender.send('igot', siftlib.goUp(pathString));
})
ipcMain.on('opn', (evt, pathString) => {
    evt.sender.send('igot', { 'pathString': pathString, 'pagedata': '', 'type': 'file' })
})
