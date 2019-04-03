// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

import electron from 'electron';
import path from 'path';
import fs from 'fs';
import * as crypto from './CryptoHelper';

interface Options {
    configName: string;
    defaults: any;
    password: string;
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
        let ekey = crypto.encrypt(key, this.opts.password);
        let evalue = this.data[ekey];
        if (evalue) {
            return crypto.decrypt(evalue, this.opts.password);
        }

        return defaultValue;
    }

    save(key: string, value: string) {
        let ekey = crypto.encrypt(key, this.opts.password);
        let evalue = crypto.encrypt(value, this.opts.password);

        this.data[ekey] = evalue;
        fs.writeFile(this.configFile, JSON.stringify(this.data), { encoding: 'utf8' }, err => err ? console.error(err) : undefined);
    }
}