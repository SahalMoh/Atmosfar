const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 720,
    minWidth: 1380,
    show: true,
    autoHideMenuBar: true,
    roundedCorners: true,
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    hasShadow: true,
    vibrancy: 'ultra-dark',
    visualEffectState: 'active',
    frame: false,
    backgroundColor: '#FFF',
    closable: true,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: false,
      webSecurity: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  require('@electron/remote/main').initialize();
  require('@electron/remote/main').enable(mainWindow.webContents);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on('get-app-version', (event) => {
    const packageJson = require(path.join(app.getAppPath(), 'package.json'));
    event.returnValue = packageJson.version;
  });
}

function openMainWindow() {
  if (mainWindow) {
    mainWindow.show();
  } else {
    createMainWindow();
  }
}

app.on('ready', openMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});