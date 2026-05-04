const { app, BrowserWindow, Menu, protocol, net } = require('electron')
const path = require('path')
const url = require('url')

// Register the scheme as privileged
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
])

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'NEWSROOM',
    webPreferences: { 
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Set up the custom protocol handler
  protocol.handle('app', (request) => {
    const urlPath = new URL(request.url).pathname
    // When packaged, dist is in the same folder as main.js
    const baseDir = app.isPackaged ? __dirname : path.join(__dirname, '..')
    const filePath = path.join(baseDir, 'dist', urlPath === '/' ? 'index.html' : urlPath)
    return net.fetch(url.pathToFileURL(filePath).toString())
  })

  win.loadURL('app://./')

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'Refresh', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' },
        { type: 'separator' },
        { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'togglefullscreen' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [{ label: 'About NEWSROOM', click: () => {} }]
    }
  ])
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })