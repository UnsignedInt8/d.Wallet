// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

const electron = require('electron');
const path = require('path');
const fs = require('fs') ;
import * as crypto from './CryptoHelper';

interface Options {
    configName: string;
    defaults: any;
    password: string;
    encryption: boolean;
}

export default class PersistenceHelper {

    private configFile: string;
    private data: any;
    private opts: Options;

    constructor(opts: Options) {
        this.opts = opts;

        let userPath = (electron.app || electron.remote.app).getPath('userData');
        this.configFile = path.join(userPath, `${opts.configName}.json`);

        try {
            this.data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        } catch (error) {
            this.data = opts.defaults;
        }
    }

    load(key: string, defaultValue?: string): string | undefined {
        let ekey = this.opts.encryption ? crypto.encrypt(key, this.opts.password) : key;
        let evalue = this.data[ekey];
        if (evalue) {
            return this.opts.encryption ? crypto.decrypt(evalue, this.opts.password) : evalue;
        }

        return defaultValue;
    }

    save(key: string, value: string) {
        let ekey = this.opts.encryption ? crypto.encrypt(key, this.opts.password) : key;
        let evalue = this.opts.encryption ? crypto.encrypt(value, this.opts.password) : value;

        this.data[ekey] = evalue;
        fs.writeFile(this.configFile, JSON.stringify(this.data), { encoding: 'utf8' }, err => err ? console.error(err) : undefined);
    }

    static exists(configName: string) {
        let userPath = (electron.app || electron.remote.app).getPath('userData');
        let configFile = path.join(userPath, `${configName}.json`);

        return new Promise<boolean>(resolve => {
            fs.exists(configFile, e => {
                resolve(e);
            });
        });
    }
}