import PersistenceHelper from '../lib/PersistenceHelper';
import { observable, computed } from 'mobx';
import { getLang } from '../i18n';
import { EventEmitter } from 'events';

export class AppSettings extends EventEmitter {
    private helper: PersistenceHelper;

    constructor(password: string) {
        super();
        this.helper = new PersistenceHelper({ configName: 'config', defaults: {}, password, encryption: true });

        this._autolock = this.helper.load('autolock', 'true') === 'true';
        this._lang = this.helper.load('lang', '') || '';
        this._mnemonic = this.helper.load('mnemonic', '') || '';
    }

    private _mnemonic: string;

    get mnemonic() { return this._mnemonic; }
    set mnemonic(value: string) {
        if (value === this._mnemonic) return;
        this._mnemonic = value;
        this.helper.save('mnemonic', value);
        super.emit('mnemonic');
    }

    @observable
    private _autolock: boolean;

    @computed
    get autolock() { return this._autolock; }
    set autolock(value: boolean) {
        if (value === this._autolock) return;
        this._autolock = value;
        this.helper.save('autolock', `${value}`)
    }

    @observable
    private _lang: string;

    @computed
    get lang() { return this._lang; }
    set lang(value: string) {
        if (value === this._lang) return;
        this._lang = value;
        this.helper.save('lang', value);
    }

    get i18n() {
        return getLang(this.lang);
    }

    delete() {
        this.helper.delete();
    }
}

let instance: AppSettings | undefined;

export function getAppSettings(password: string) {
    if (!password) throw Error('invalid password');
    if (instance) return instance;
    instance = new AppSettings(password);
    return instance;
}