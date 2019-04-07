import en_US from './en_US';
const electron = require('electron');

let system = (electron.app || electron.remote.app).getLocale();

const langs = {
    'en': en_US,
    'en-US': en_US,
}

export function getLang(locale?: string) {
    locale = locale || system;
    return langs[locale as 'en'] || en_US;
}
