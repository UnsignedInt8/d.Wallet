import en_US from './en_US';
import zh_CN from './zh_CN';
import ja_JP from './ja_JP';
import zh_TW from './zh_TW';
const electron = require('electron');

let system = (electron.app || electron.remote.app).getLocale();

const langs = {
    'en': en_US,
    'en-US': en_US,
    'ja-JP': ja_JP,
    'zh-TW': zh_TW,
    'zh-CN': zh_CN,
    'zh': zh_CN,
}

export function getLang(locale?: string) {
    locale = locale || system;
    return langs[locale as 'en'] || en_US;
}
