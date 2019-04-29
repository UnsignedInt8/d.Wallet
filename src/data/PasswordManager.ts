// import crypto from 'crypto';
const crypto = require('crypto');
import PersistenceHelper from '../lib/PersistenceHelper';
import { EventEmitter } from 'events';

const key = 'fingerprint';

class PasswordManager extends EventEmitter {
    private _pw: string = '';
    private helper = new PersistenceHelper({ configName: 'secret', defaults: {}, encryption: false, password: '' });

    get password() { return this._pw || ''; }
    set password(value: string) {
        let pw = crypto.createHash('sha256').update(value, 'utf8').digest('hex');
        this._pw = pw;

        let pwHash = crypto.createHash('sha256').update(pw, 'utf8').digest('hex');
        this.helper.save(key, pwHash);

        super.emit('password');
    }

    clean() {
        this.helper.save(key, '');
    }

    verify(password: string) {
        let pw = this.helper.load(key);
        if (!pw) return false;

        let h1 = crypto.createHash('sha256').update(password, 'utf8').digest('hex');
        let h2 = crypto.createHash('sha256').update(h1, 'utf8').digest('hex');

        return h2 === pw;
    }

    isProtected() {
        if (this.helper.load(key)) return true;
        return false;
    }

    delete() {
        this.helper.delete();
    }
}

const singleton = new PasswordManager();

export default singleton;