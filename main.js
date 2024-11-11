const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron')
const path = require('path')

let mainWindow = null;

function createLoginWindow() {
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  loginWindow.setMenu(null)
  loginWindow.loadFile('login.html')
}

function createMainWindow(ip) {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    fullscreenable: true,
    fullscreen: false
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

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.executeJavaScript(`
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          document.webkitExitFullscreen();
        }
      });
    `);
  });

  globalShortcut.register('Escape', () => {
    if (mainWindow && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  mainWindow.loadURL(`https://${ip}/kvm/`)

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('页面加载失败:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
  });
}

app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost')
// for webrtc reduce latency
app.commandLine.appendSwitch('disable-gpu-vsync')
app.commandLine.appendSwitch('enable-zero-copy')

app.whenReady().then(() => {
  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('window-all-closed', function () {
  process.exit(0);
})

// 处理IP输入
ipcMain.on('connect-to-ip', (event, ip) => {
  createMainWindow(ip);
  // 关闭登录窗口
  BrowserWindow.getAllWindows().forEach(window => {
    if (window !== mainWindow) {
      window.close();
    }
  });
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});