const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    connect: (ip) => ipcRenderer.send('connect-to-ip', ip)
})

contextBridge.exposeInMainWorld('electronAPI', {
  connectToIP: (ip) => ipcRenderer.send('connect-to-ip', ip),
  onLoadSavedIP: (callback) => ipcRenderer.on('load-saved-ip', callback)
}) 