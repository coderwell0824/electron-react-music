// electron-main/index.ts
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const log = require('electron-log')
const path = require('path');

log.transports.file.level = 'debug';
log.transports.file.file = `${__dirname}/log.txt`;

const NOTIFICATION_TITLE = '音乐'
const NOTIFICATION_BODY = '当前播放：Stay'

// 记录日志
log.info('This is an info log message');
log.warn('This is a warning log message');
log.error('This is an error log message');

class Main {
    win: typeof BrowserWindow
    constructor() {
        this.init();
    }
    init() {
        this.onProcess()
    }
    onProcess() {
        app.whenReady().then(() => {
            this.createWindow();
            app.on('activate', () => {

                if (BrowserWindow.getAllWindows().length === 0) {
                    this.createWindow()
                }
            });
            // new Notification({
            //     title: NOTIFICATION_TITLE,
            //     body: NOTIFICATION_BODY
            // }).show()
        });
        app.on('window-all-closed', () => {
            // 如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        process.on('uncaughtException', (error) => {
            // 处理错误
            log.error('Uncaught Exception:', error);
            // 可以选择退出应用程序
            process.exit(1);
        });

    }
    createWindow() {
        const win = this.win = new BrowserWindow({
            // titleBarStyle: 'hidden',
            // titleBarOverlay: {
            //     color: '#222225',
            //     symbolColor: '#ADAFB2FF'
            // },
            minHeight: 750,
            minWidth: 1150,
            height: 850,
            width: 1250,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                nodeIntegration: true, // 为了解决required识别问题
                // // 需要设置contextIsolation属性为false。
                // // 但是使用某些api，比如拖拽开发功能的contextBridge需要contextIsolation为true。
                // contextIsolation: true,
                contextIsolation: false,
                enableRemoteModule: true,
                preload: path.join(__dirname, './preload.js'),
            },
            frame: false,
            // icon: path.join(__dirname, '../src/assets/logo.ico'),
        });
        if (app.isPackaged) {
            win.loadFile(path.join(__dirname, '../index.html'));
            // win.loadURL(`file://${__dirname}/index.html`);
        } else {
            // Use ['ENV_NAME'] avoid vite:define plugin
            const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;
            win.loadURL(url);
        }
        this.ipcWindowEvent()
        win.webContents.openDevTools()
    }
    ipcWindowEvent() {
        ipcMain.on('maximize', (event: any) => {
            this.win.maximize()
        })
        ipcMain.on('unmaximize', (event: any) => {
            this.win.unmaximize()
        })
        ipcMain.on('minimize', (event: any) => {
            this.win.minimize()
        })
        ipcMain.on('restore', (event: any) => {
            this.win.restore()
        })
        ipcMain.on('close', (event: any) => {
            this.win.close()
        })
        ipcMain.on('reset', (event: any) => {
            app.exit();//退出当前程序
            app.relaunch();//重新启动
        })
        ipcMain.on('getUserDataPath', (event: any) => {
            const userDataPath = app.getPath('userData');
            // event.sender.send('user-data-path', userDataPath);
        })
    }
}

const main = new Main();

export default {}
