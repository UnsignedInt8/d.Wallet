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

    win = new BrowserWindow({ width: 461, height: 648, webPreferences: { nodeIntegration: true }, titleBarStyle: 'hidden' });

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
        }, 10 * 1000);
    });
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
