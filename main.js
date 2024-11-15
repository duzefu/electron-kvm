const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store');

// 创建 store 实例
const store = new Store();
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

  // 发送上次保存的 IP 到登录窗口
  loginWindow.webContents.on('did-finish-load', () => {
    const savedIp = store.get('lastIP');
    if (savedIp) {
      loginWindow.webContents.send('load-saved-ip', savedIp);
    }
  });
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

// 修改 IP 输入处理
ipcMain.on('connect-to-ip', (event, ip) => {
  // 保存 IP 到 store
  store.set('lastIP', ip);
  createMainWindow(ip);
  // 关闭登录窗口
  BrowserWindow.getAllWindows().forEach(window => {
    if (window !== mainWindow) {
      window.close();
    }
  });
})