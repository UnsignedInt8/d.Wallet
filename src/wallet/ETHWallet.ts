import { Wallet } from "./Wallet";
import * as ETHUtils from 'ethereumjs-util';
import { keccak } from "../lib/Hash";
import * as assert from 'assert';
import { toBuffer } from '../lib/Hash';

export default class ETHWallet extends Wallet {

    constructor(opts: { mnemonic: string, path?: string, }) {
        super(opts);
    }

    protected getDefaultPath(): string {
        return `m/44'/60'/0'/0`;
    }

    private _address?: string;
    get address() {
        if (this._address) return this._address;
        let hdKey = this._root.derive(this.getPathIndex(0));
        let ethPubkey = ETHUtils.privateToPublic(hdKey['privateKey'].toBuffer());
        this._address = this.pubToAddress(ethPubkey);
        return this._address as string;
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    private pubToAddress(pubkey: Buffer) {
        let pubkeyBuf = toBuffer(pubkey);
        assert(pubkey.length === 64)
        let data = keccak(pubkeyBuf).slice(-20);
        return ETHUtils.bufferToHex(data);
    }
}