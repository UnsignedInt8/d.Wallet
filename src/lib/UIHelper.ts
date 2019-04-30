export default class UIHelper {
    static readonly isWin = process.platform === 'win32';
    static readonly isDarwin = process.platform === 'darwin';
    static readonly scrollBarClassName = process.platform === 'darwin' ? '' : 'scrollbar';
}