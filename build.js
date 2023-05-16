var electronInstaller = require('electron-winstaller');
var path = require("path");

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: path.join('./dist/http-parser-win32-x64'), //刚才生成打包文件的路径
    outputDirectory: path.join('./setup'), //输出路径
    authors: 'dreamfly', // 作者名称
    exe: 'http-parser.exe', //在appDirectory寻找exe的名字
    iconUrl: path.join(__dirname, 'icons', 'icn.ico'), // 图标文件路径,
    shortcuts: true,
    setupExe: 'Simple-Http-parser-Setup.exe',
    shortcutName: 'Simple-Http-Parser',
    menuCategory: true,
    setupIcon: path.join(__dirname, 'icons', 'icn.ico'), // 图标文件路径,
    customInstallLocation: true, // 允许用户选择安装目录
    defaultInstallLocation: '%LOCALAPPDATA%\\http-parser', // 指定默认安装目录
    installDirectory: '%LOCALAPPDATA%\\http-parser',
    noMsi: true
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));