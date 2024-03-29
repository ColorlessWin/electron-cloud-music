import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}




let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    width: 1250,
    frame: false,
    titleBarStyle: 'hidden',
    useContentSize: true,

    webPreferences: {
      nodeIntegration: true,
    },

    show: false
  })
  

  mainWindow.loadURL(winURL)

  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.setZoomFactor(1.0)
    mainWindow.show()
  })


  ipcMain.on('window-min', mainWindow.minimize.bind(mainWindow))
  ipcMain.on('window-close', mainWindow.close.bind(mainWindow))
  ipcMain.on('window-max', () => {
    // mainWindow.webContents.openDevTools();
    if (mainWindow.isMaximized()) mainWindow.unmaximize()
    else mainWindow.maximize()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// app.whenReady().then(() => {
//   // 注册快捷键
//   globalShortcut.register('Alt+CommandOrControl+I', () => {
//     console.log('Electron loves global shortcuts!')
//     mainWindow.webContents.openDevTools();
//   })
// })

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
