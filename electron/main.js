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
    icon: path.join(__dirname, '../assets/images/icon_512.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false // Temporary to rule out CORS issues with fonts
    }
  })

  // Set up the custom protocol handler
  protocol.handle('app', async (request) => {
    const parsedUrl = new URL(request.url)
    let urlPath = parsedUrl.pathname
    
    // Normalize path: remove leading slash and handle Windows formats
    urlPath = path.normalize(urlPath).replace(/^[\\\/]+/, '')
    if (!urlPath || urlPath === '.' || urlPath === 'index.html') urlPath = 'index.html'

    const baseDir = app.isPackaged ? __dirname : path.join(__dirname, '..')
    const filePath = path.join(baseDir, 'dist', urlPath)
    
    try {
      const response = await net.fetch(url.pathToFileURL(filePath).toString())
      const extension = path.extname(filePath).toLowerCase()
      
      const mimeTypes = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      }

      const contentType = mimeTypes[extension] || response.headers.get('content-type')

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (e) {
      console.error(`Failed to load file: ${filePath}`, e)
      return new Response('Not Found', { status: 404 })
    }
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
      submenu: [{ label: 'About NEWSROOM', click: () => { } }]
    }
  ])
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })