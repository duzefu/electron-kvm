const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  connectToIP: (ip, username, password, rememberMe) => 
    ipcRenderer.send('connect-to-ip', ip, username, password, rememberMe),
  onLoadSavedCredentials: (callback) => 
    ipcRenderer.on('load-saved-credentials', callback),
  closeWindow: () => ipcRenderer.send('close-window')
}) 