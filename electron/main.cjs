const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 880,
    minWidth: 860,
    minHeight: 620,
    title: 'Orbital Year Tracker',
    backgroundColor: '#faf8f5',
    show: false, // Wait until ready-to-show to prevent flash of blank white
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  // Smooth appearance when content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  // Open external links in user's default desktop browser instead of Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(devServerUrl);
  } else {
    // In production or preview mode, load the bundled dist/index.html
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load local HTML file, attempting fallback URL...', err);
      mainWindow.loadURL(devServerUrl);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock to prevent duplicate windows
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
