export default class UIHelper {
    static readonly isDarwin = process.platform === 'darwin';
    static readonly scrollBarClassName = process.platform === 'darwin' ? '' : 'scrollbar';
}