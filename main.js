// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, nativeImage } = require('electron')
const path = require('path')
// const { spawn } = require('child_process')
const server = require('./server.js')
const createWindow = () => {

  const iconPath = path.join(__dirname, 'icons', 'icn.png'); // 图标文件路径
  const icon = nativeImage.createFromPath(iconPath) // 创建 NativeImage 对象
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: icon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()

  // 隐藏菜单栏
  mainWindow.setAutoHideMenuBar(true)
  mainWindow.setMenuBarVisibility(false)
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  // const serverProcess = spawn('node', ['server.js'])
  // serverProcess.stdout.on('data', (data) => {
  //   console.log(`${data}`)
  // })
  // serverProcess.stderr.on('data', (data) => {
  //   console.error(`${data}`)
  // })
  // serverProcess.on('close', (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
  server.start() // 启动服务器
  createWindow()
  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 创建桌面快捷方式
if(require('electron-squirrel-startup')) return;