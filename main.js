const { app, BrowserWindow, ipcMain, Tray } = require('electron');
const { autoUpdater } = require('electron-updater');

let tray;
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 320,
    height: 568,
    show:false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
  tray = new Tray('logo.png')
  tray.setToolTip('wesense')
  tray.on('click', (d)=>{
    console.log('anp tray', d);
    if(mainWindow.isVisible()){
      mainWindow.hide()
    }else{
      mainWindow.show()
    }
  })
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});


app.setLoginItemSettings({openAtLogin:true})
