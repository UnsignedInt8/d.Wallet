import { Wallet, TxInfo } from "./Wallet";
import * as ETHUtils from 'ethereumjs-util';
import { keccak } from "../lib/Hash";
import * as assert from 'assert';
import { toBuffer } from '../lib/Hash';
import { observable, computed } from "mobx";
import Blockchair, { Chain } from "./api/Blockchair";
import * as Units from 'ethereumjs-units';
import { IUtxo } from './Wallet';
import * as hex2dec from 'hex2dec';
import { PrivateKey } from 'bitcore-lib';
const EthereumTx = require("ethereumjs-tx");

export default class ETHWallet extends Wallet {

    async genTx(opts: { to: { address: string; amount: string; }[]; message?: string | undefined; gasPrice: string }): Promise<{ hex: string; id: string; change: { address: string; amount: number; }; msg?: string, fee: number; from: string[], to: any[] } | undefined> {
        let info = await this.scanAddresses();
        if (!info) return;

        let [key] = this.getKeys(0, 1);
        let privkey = Buffer.from((key['privateKey'] as PrivateKey).toString(), 'hex');

        throw new Error("Method not implemented.");
    }

    buildTx(args: { inputs: IUtxo[]; outputs: { address: string; amount: number; }[]; satoshiPerByte: number; changeIndex?: number | undefined; }): { tx: import("bitcoinjs-lib").Transaction | import("bitcore-lib").Transaction; change: { address: string; amount: number; }; fee: number; } {
        throw new Error("Method not implemented.");
    }

    protected genAddress(key: import("bitcore-lib").HDPrivateKey): string[] {
        throw new Error("Method not implemented.");
    }


    protected getExternalPath(): string {
        return `m/44'/60'/0'/0`;
    }

    protected getChangePath(): string {
        throw new Error('ETH does not need change addresses');
    }

    get symbol() { return 'eth'; }
    get chain(): Chain { return 'ethereum'; }

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

    get changes() { return []; }

    private pubToAddress(pubkey: Buffer) {
        let pubkeyBuf = toBuffer(pubkey);
        assert(pubkey.length === 64)
        let data = keccak(pubkeyBuf).slice(-20);
        return ETHUtils.bufferToHex(data);
    }

    async refresh() {
        let [info] = await this.scanAddresses();
        if (!info) return;

        this.balance = Units.convert(info.balance || 0, 'wei', 'eth');
        this.txs = info.txs;

        this.save('balance', this.balance);
        this.save('txs', this.txs);
    }

    protected async scanAddresses() {
        let [address] = this.mainAddress;
        let info = await Blockchair.fetchETHAddress(address);
        if (!info) return [];

        let balance = info.address.balance || 0;
        let txs = info.calls.map(c => {
            return <TxInfo>{
                amount: (BigInt(c.value) / BigInt('1000000000000000000')).toString(),
                blockHash: '',
                blockHeight: c.block_id,
                hash: c.transaction_hash,
                inputs: [{ address: [c.sender], value: 0 }],
                outputs: [{ address: [c.recipient], value: 0 }],
                timestamp: new Date(c.time).getTime(),
                isIncome: c.recipient.toLowerCase() === address,
                fee: 0,
                success: c.transferred,
            };
        });

        return [{ address, balance, txs, nonce: info.address.spending_call_count }];
    }

    buildETHTx(args: { to: { address: string, amount: string }, msg?: string, gasPrice: string, nonce: number }, balance: number, key: Buffer) {
        let data = Buffer.from(args.msg || '', 'utf8');
        let gasLimit = 21000 + 68 * data.length;//: string = hex2dec.decToHex(`${}`);

        let balanceWei = BigInt(Units.convert(balance, 'eth', 'wei'));
        let fee = BigInt(gasLimit) * BigInt(args.gasPrice);
        let amount = BigInt(args.to.amount);
        let value = amount;

        if (balanceWei < amount + fee) {
            value = balanceWei - fee;
        }

        const txParams = {
            to: args.to.address,
            nonce: hex2dec.decToHex(`${args.nonce}`),
            value: hex2dec.decToHex(value.toString()),
            gasPrice: hex2dec.decToHex(args.gasPrice),
            gasLimit,
            data: data.length === 0 ? '0x' : data,
            chainId: 1,
        };

        let tx = new EthereumTx(txParams);

        tx.sign(key);
        let signed: Buffer = tx.serialize();
        let txid = '0x' + tx.hash().toString('hex');

        return { hex: '0x' + signed.toString('hex'), txid, fee: fee.toString(), value: value.toString(), txParams };
    }

}