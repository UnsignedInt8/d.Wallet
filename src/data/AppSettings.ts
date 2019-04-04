import PersistenceHelper from '../lib/PersistenceHelper';
import { observable, computed } from 'mobx';

class AppSettings {
    private helper: PersistenceHelper;

    constructor(password: string) {
        this.helper = new PersistenceHelper({ configName: 'config', defaults: {}, password, encryption: true });

        this._autolock = this.helper.load('autolock', 'true') === 'true';
        this._lang = this.helper.load('lang', '') || '';
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
}

let instance: AppSettings | undefined;

export default function getInstance(password: string) {
    if (instance) return instance;
    instance = new AppSettings(password);
    return instance;
}