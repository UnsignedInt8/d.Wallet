import en_US from './en_US';
const electron = require('electron');

let locale = (electron.app || electron.remote.app).getLocale();

const langs = {
    'en': en_US,
    'en-US': en_US,
}

export function getLang(locale: string) {
    return langs[locale as 'en'] || en_US;
}
