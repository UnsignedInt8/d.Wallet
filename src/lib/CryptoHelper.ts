import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const iv = Buffer.from('d499aec91cb6228b0749b42d1bdf7c12', 'hex');

export function encrypt(text: string, password: string) {
    let pw = crypto.createHash('sha256').update(password).digest();
    let cipher = crypto.createCipheriv(algorithm, pw, iv)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

export function decrypt(cipher: string, password: string) {
    let pw = crypto.createHash('sha256').update(password).digest();
    let decipher = crypto.createDecipheriv(algorithm, pw, iv)
    let dec = decipher.update(cipher, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}