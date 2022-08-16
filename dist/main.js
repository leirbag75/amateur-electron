const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Make sure database exists and has required tables
const databasePath = path.join(__dirname, '../amateur.db');
if(!fs.existsSync(databasePath))
  require(path.join(__dirname, '../src/create-database'));

const sqlite3 = require(path.join(__dirname, '../src/sqlite3-wrapper'));
const db = new sqlite3.Database(path.join(__dirname, '../amateur.db'));
const FetchHandler = require(path.join(__dirname, '../src/fetch-handler'));

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  ipcMain.handle('fetch', (dontCare, url) => {
    return FetchHandler.forUrl(url, db).handle();
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});
