const { app, BrowserWindow, ipcMain } = require('electron')
function createWindow() {
let win = new BrowserWindow({ title: 'Voyager', nodeIntegration: true, icon: "./bin/img/app.png", width: 1200, height: 900, frame: false, transparent: true, vibrancy: 'ultra-dark', webPreferences: { experimentalFeatures: true } })
win.loadFile('./bin/html/voyager.html')
    ipcMain.on('ntf', (evt, alertText) => {
        let nwin = new BrowserWindow({ title: 'Error', nodeIntegration: true, icon: "./bin/img/app.png", width: 400, height: 225, frame: false, transparent: true, vibrancy: 'ultra-dark', webPreferences: { experimentalFeatures: true }, resizable: false });
        nwin.loadFile('./bin/html/notify.htm');
        ipcMain.on('gte', (evt) => {
            evt.sender.send('erm', alertText);
        })
    })
}
app.on('ready', createWindow)
