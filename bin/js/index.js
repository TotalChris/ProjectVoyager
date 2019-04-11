const { app, BrowserWindow, ipcMain } = require('electron')
const proc = require('process');
const os = require('os');
function createWindow() {
let win = new BrowserWindow({ title: 'Voyager', nodeIntegration: true, icon: "./bin/img/app.png", width: 1200, height: 900, frame: false, transparent: true, vibrancy: 'ultra-dark', webPreferences: { experimentalFeatures: true } })
win.loadFile('./bin/html/voyager.html')
    ipcMain.on('gth', (evt) => {
    var launchpath
        if((proc.argv[2] !== undefined)){
            launchpath = proc.argv[2];
        } else {
            launchpath = os.homedir().replace(/\\/g, '/');
        }
        console.log(launchpath)
            evt.sender.send('goto', launchpath);
    })
    ipcMain.on('ntf', (evt, alertText) => {
        let nwin = new BrowserWindow({ title: 'Error', nodeIntegration: true, icon: "./bin/img/app.png", width: 400, height: 225, frame: false, transparent: true, vibrancy: 'ultra-dark', webPreferences: { experimentalFeatures: true }, resizable: false });
        nwin.loadFile('./bin/html/notify.htm');
        ipcMain.on('gte', (evt) => {
            evt.sender.send('erm', alertText);
        })
    })
}
app.on('ready', createWindow)
