const { app, BrowserWindow, globalShortcut, dialog, ipcMain, safeStorage } = require('electron')
const path = require('path')
const Store = require('electron-store');

// 创建 store 实例
const store = new Store();
let mainWindow = null;

function encryptCredentials(password) {
  return safeStorage.encryptString(password).toString('base64');
}

function decryptCredentials(encryptedPassword) {
  try {
    return safeStorage.decryptString(Buffer.from(encryptedPassword, 'base64'));
  } catch (error) {
    console.error('解密失败:', error);
    return '';
  }
}

function createLoginWindow() {
  const loginWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  loginWindow.setMenu(null)
  loginWindow.loadFile('login.html')

  // 发送保存的凭据到登录窗口
  loginWindow.webContents.on('did-finish-load', () => {
    const savedCredentials = {
      ip: store.get('lastIP'),
      username: store.get('username'),
      password: store.get('password') ? decryptCredentials(store.get('password')) : ''
    };
    
    if (savedCredentials.ip || savedCredentials.username) {
      loginWindow.webContents.send('load-saved-credentials', savedCredentials);
    }
  });
}

function createMainWindow(ip, username, password) {
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
    
    // 检查是否在登录页面
    const checkAndLogin = `
      if (window.location.pathname.includes('/login')) {
        // 等待一下确保表单元素已加载
        setTimeout(() => {
          // 使用正确的ID选择器查找表单元素
          const usernameInput = document.querySelector('#user-input');
          const passwordInput = document.querySelector('#passwd-input');
          const loginButton = document.querySelector('#login-button');
          
          if (usernameInput && passwordInput && loginButton) {
            console.log('找到登录表单元素');
            
            // 填充用户名和密码
            usernameInput.value = ${JSON.stringify(username)};
            passwordInput.value = ${JSON.stringify(password)};
            
            // 触发输入事件以确保任何监听器都能捕获到变化
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            // 等待一小段时间确保值已经被正确设置
            setTimeout(() => {
              console.log('点击登录按钮');
              loginButton.click();
            }, 500);
          } else {
            console.log('未找到登录表单元素:', {
              username: !!usernameInput,
              password: !!passwordInput,
              button: !!loginButton
            });
          }
        }, 1000);
      } else {
        console.log('不在登录页面:', window.location.pathname);
      }
    `;
    
    // 只有在提供了用户名和密码的情况下才执行自动登录
    if (username && password) {
      mainWindow.webContents.executeJavaScript(checkAndLogin);
    }
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
ipcMain.on('connect-to-ip', (event, ip, username, password, rememberMe) => {
  // 保存凭据到 store
  store.set('lastIP', ip);
  
  if (rememberMe) {
    store.set('username', username);
    store.set('password', encryptCredentials(password));
  } else {
    store.delete('username');
    store.delete('password');
  }
  
  createMainWindow(ip, username, password);
  // 关闭登录窗口
  BrowserWindow.getAllWindows().forEach(window => {
    if (window !== mainWindow) {
      window.close();
    }
  });
})