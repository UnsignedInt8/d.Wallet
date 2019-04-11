import { Wallet } from "./Wallet";
import Tx from 'ethereumjs-tx';
import EthCrypto from 'eth-crypto';
import ETHWalletjs from 'ethereumjs-wallet';
import * as ETHUtils from 'ethereumjs-util';
import secp256k1 from 'secp256k1';
import { keccak } from "../lib/Hash";

export default class ETHWallet extends Wallet {

    static readonly defaultPath = `m/44'/60'/0'/0/0`;

    constructor(opts: { mnemonic: string, path: string, }) {
        super(opts);
    }

    private _address?: string;
    get address() {
        if (this._address) return this._address;
        let key = this._root.derive(this.getPathIndex(0));
        let pubkey = key.hdPublicKey.publicKey.toBuffer();
        let privkey = key['privateKey'].toString();
        // const publicKey = EthCrypto.publicKeyByPrivateKey(privkey);
        // console.log(ETHWalletjs.fromPublicKey(key.hdPublicKey.publicKey.toString()).getAddressString());
        // console.log(publicKey, key.hdPublicKey.publicKey);
        // this._address = EthCrypto.publicKey.toAddress(publicKey);
        // console.log(ETHUtils.publicToAddress(key.hdPublicKey.publicKey.toBuffer()));
        console.log(this.pubToAddress(pubkey));
        return this._address as string;
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    pubToAddress(pubkey: Buffer) {
        let data = keccak(pubkey).slice(-20);
        return ETHUtils.bufferToHex(data);
    }
}