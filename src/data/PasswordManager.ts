import crypto from 'crypto';

class PasswordManager {
    private _pw: string = '';
    get password() { return this._pw || ''; }
    set password(value: string) {
        let pw = crypto.createHash('sha256').update(value).digest('hex');
        this._pw = pw;
    }
}

const singleton = new PasswordManager();

export default singleton;