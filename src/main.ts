import path from 'node:path';
import { BrowserWindow, app, ipcMain, Menu, dialog, session } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

var log = require('electron-log');

process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

app.disableHardwareAcceleration();

function createWindow () {
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000',
      symbolColor: '#FFFFFF',
      height: 30
    },
    width: 1200,
    height: 900,
    resizable: true,
    minWidth: 1200,
    minHeight: 900,
    webPreferences: {
      // webpack が出力したプリロードスクリプトを読み込み
      preload: path.join(__dirname, 'preload.js'),
      defaultEncoding: 'UTF-8',
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  // レンダラープロセスをロード
  mainWindow.loadFile('dist/index.html');
  mainWindow.loadURL('http://localhost:3000/');

  // Menu.setApplicationMenu(null);
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(async () => {
  // React Developer Tools のインストール
  try {
    await installExtension(REACT_DEVELOPER_TOOLS);
    log.info('React Developer Tools installed successfully');
  } catch (err) {
    log.error('Failed to install React Developer Tools: ', err);
  }

  session.defaultSession.clearCache().then(() => {
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('UnRedo-action', (event, payload) => {
  try {
    const { action, count } = payload;
    event.sender.send('UnRedo-action', action, count);
  } catch (error) {
    console.error('Failed to handle the payload:', error);
  }
});

ipcMain.on('show-error', (event, title, message) => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) return;
  dialog.showMessageBox(focusedWindow, {
      type: 'error',
      title: title,
      message: message,
      buttons: ['OK'],
  });
});