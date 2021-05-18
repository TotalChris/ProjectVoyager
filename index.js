const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron')
function createWindow() {

let win = new BrowserWindow({ width: 1200, height: 1000, frame: false, webPreferences: { experimentalFeatures: true, nodeIntegration: true, contextIsolation: false } })
//
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
            console.log('maximized on main');
            win.maximize();
            evt.sender.send('maxd');
        } else {
            console.log('resized on main');
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
app.on('ready', createWindow)
