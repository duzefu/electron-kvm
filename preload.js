const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    connect: (ip) => ipcRenderer.send('connect-to-ip', ip)
}) 