import { app, BrowserWindow, Tray, Menu, nativeImage, screen } from 'electron'
import { join } from 'path'

const W = 360
const H = 640
let win: BrowserWindow
let tray: Tray
let hiddenAt = 0

function place() {
  const t = tray.getBounds()
  const d = screen.getDisplayNearestPoint({ x: t.x, y: t.y }).workArea
  let x = Math.round(t.x + t.width / 2 - W / 2)
  let y = t.y - H - 8
  x = Math.min(Math.max(x, d.x + 8), d.x + d.width - W - 8)
  y = Math.min(Math.max(y, d.y + 8), d.y + d.height - H - 8)
  win.setPosition(x, y, false)
}

function toggle() {
  if (win.isVisible()) return win.hide()
  if (Date.now() - hiddenAt < 250) return // o clique no ícone causou o blur que acabou de fechar
  place()
  win.show()
  win.focus()
}

app.whenReady().then(() => {
  if (!app.requestSingleInstanceLock()) return app.quit()

  win = new BrowserWindow({
    width: W, height: H, show: false, frame: false, resizable: false, skipTaskbar: true,
    alwaysOnTop: true, roundedCorners: true, backgroundMaterial: 'acrylic', backgroundColor: '#00000000',
    webPreferences: { contextIsolation: true }
  })
  win.on('blur', () => { hiddenAt = Date.now(); win.hide() })

  if (process.env['ELECTRON_RENDERER_URL']) win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  else win.loadFile(join(__dirname, '../renderer/index.html'))

  tray = new Tray(nativeImage.createFromPath(join(__dirname, '../../resources/icon.png')))
  tray.setToolTip('Ar-condicionado')
  tray.on('click', toggle)
  tray.setContextMenu(Menu.buildFromTemplate([{ label: 'Sair', click: () => app.quit() }]))
  // Dica: o clique direito abre o menu; o esquerdo abre o painel.
})

app.on('window-all-closed', (e: Event) => e.preventDefault())
