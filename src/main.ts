import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';


let win: BrowserWindow | null;
let blurTimer: any;

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }

    win = new BrowserWindow({
        width: 500, height: 648,
        titleBarStyle: 'hidden',
        webPreferences: { nodeIntegration: true, nodeIntegrationInWorker: true, sandbox: false, webSecurity: false },
    });

    if (process.env.NODE_ENV !== 'production') {
        win.loadURL(`http://localhost:2003`);
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== 'production') {
        // Open DevTools
        win.webContents.openDevTools();
    }

    win.on('closed', () => {
        if (win) win.removeAllListeners();
        win = null;
    });

    win.on('focus', () => {
        clearTimeout(blurTimer);
        blurTimer = undefined;
    });

    win.on('blur', () => {
        if (blurTimer) return;

        blurTimer = setTimeout(() => {
            if (!win) return;
            win.webContents.send('autolock');
            blurTimer = null;
        }, 60 * 5 * 1000);
    });

    win.webContents.setUserAgent([`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36`, `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Safari/605.1.15`][Date.now() % 2]);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (!win) return;
        if (win.isMinimized()) win.restore()
        win.focus()
    });
}