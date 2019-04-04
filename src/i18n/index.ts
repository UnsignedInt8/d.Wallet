import en_US from './en_US';
import electron from 'electron';

let locale = (electron.app || electron.remote.app).getLocale();

const langs = {
    'en': en_US,
    'en-US': en_US,
}

class i18n {
    
}