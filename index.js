//modules
const fs = require('fs');
const siftlib = require('./siftlib');
const { app, BrowserWindow, ipcMain, shell } = require('electron')
//history variables
var hindex = 0
var hist = [];

//functions
function createWindow() {
let win = new BrowserWindow({ width: 1200, height: 1000, frame: false, webPreferences: { experimentalFeatures: true} })
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
        if (win.isMaximized() === false) {
            win.maximize();
            evt.sender.send('maxd');
        } else {
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

