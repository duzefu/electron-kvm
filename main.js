const { app, BrowserWindow, globalShortcut, dialog } = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })

  mainWindow.setMenu(null)

  mainWindow.on('close', () => {
    mainWindow.destroy()
  })

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(true);
  });

  mainWindow.webContents.session.setCertificateVerifyProc((request, callback) => {
    callback(0);
  });

  mainWindow.loadURL('https://192.168.113.131/kvm/')

//   mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('页面加载失败:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
  });
}

app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost')

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  process.exit(0);
}) 