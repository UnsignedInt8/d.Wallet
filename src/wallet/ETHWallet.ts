import { Wallet, TxInfo } from "./Wallet";
import * as ETHUtils from 'ethereumjs-util';
import { keccak } from "../lib/Hash";
import * as assert from 'assert';
import { toBuffer } from '../lib/Hash';
import { observable, computed } from "mobx";
import Blockchair from "./api/Blockchair";
import * as Units from 'ethereumjs-units';

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

    get symbol() { return 'eth'; }

    private _mainAddress?: string[];
    get mainAddress() {
        return ['0x4ddea3e2fc634061C421F1E9E9d998b7595E4277'] as string[];
        // if (this._mainAddress) return this._mainAddress;
        // let hdKey = this._root.derive(this.getExternalPathIndex(0));
        // let ethPubkey = ETHUtils.privateToPublic(hdKey['privateKey'].toBuffer());
        // this._mainAddress = [this.pubToAddress(ethPubkey)];
        // return this._mainAddress as string[];
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

    async refresh() {
        let [info] = await this.scanAddresses();
        if (!info) return;

        this.balance = Units.convert(info.balance, 'wei', 'eth');
        this.txs = info.txs;

        this.save('balance', this.balance);
        this.save('txs', this.txs);
    }

    protected async scanAddresses() {
        let [address] = this.mainAddress;
        let info = await Blockchair.fetchETHAddress(address);
        if (!info) return [];

        let balance = info.address.balance;
        let txs = info.calls.map(c => {
            return <TxInfo>{
                amount: BigInt(c.value).toString(),
                blockHash: '',
                blockHeight: c.block_id,
                hash: c.transaction_hash,
                inputs: [{ address: [c.sender], value: 0 }],
                outputs: [{ address: [c.recipient], value: 0 }],
                timestamp: new Date(c.time).getTime(),
                isIncome: c.recipient.toLowerCase() === address,
            };
        });

        return [{ address, balance, txs }];
    }
}