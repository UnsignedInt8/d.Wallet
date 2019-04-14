import { Wallet } from "./Wallet";
import * as ETHUtils from 'ethereumjs-util';
import { keccak } from "../lib/Hash";
import * as assert from 'assert';
import { toBuffer } from '../lib/Hash';
import { observable, computed } from "mobx";

export default class ETHWallet extends Wallet {
    protected genAddress(key: import("bitcore-lib").HDPrivateKey): string[] {
        throw new Error("Method not implemented.");
    }

    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    protected getExternalPath(): string {
        return `m/44'/60'/0'/0`;
    }

    protected getChangePath(): string {
        throw new Error('ETH does not need change addresses');
    }

    protected scanAddresses(from: number, to: number, external = true): any {
        throw new Error('ETH dose not need discovering addresses');
    }
    
    get symbol() { return 'eth'; }

    private _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let hdKey = this._root.derive(this.getExternalPathIndex(0));
        let ethPubkey = ETHUtils.privateToPublic(hdKey['privateKey'].toBuffer());
        this._mainAddress = [this.pubToAddress(ethPubkey)];
        return this._mainAddress as string[];
    }

    @observable _addresses?: string[][];
    @computed get addresses() {
        if (this._addresses) return this._addresses;
        return [this.mainAddress];
    }

    private pubToAddress(pubkey: Buffer) {
        let pubkeyBuf = toBuffer(pubkey);
        assert(pubkey.length === 64)
        let data = keccak(pubkeyBuf).slice(-20);
        return ETHUtils.bufferToHex(data);
    }

    refresh() { }
}