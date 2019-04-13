import { Wallet } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey } from "bitcore-lib";
import { from as linq } from 'fromfrom';

export default class BTCWallet extends Wallet {

    static readonly symbol: 'btc';

    private _network?: bitcoin.Network;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, segwit?: boolean, network?: bitcoin.Network }) {
        super(opts);
        this._segwit = opts.segwit === undefined ? true : opts.segwit;
        this._network = opts.network;
    }

    protected getExternalPath(): string {
        return `m/44'/0'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/0'/0'/1`;
    }

    private _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(super.getExternalPathIndex(0));

        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        // let p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: this._network });
        this._mainAddress = [p2wpkh.address!, p2pkh.address!,];//this.genAddress(key);

        return this._mainAddress as string[];
    }

    private _segwit = true;

    get segwit() { return this._segwit; }
    set segwit(value: boolean) {
        if (this._segwit === value) return;
        this._segwit = value;
    }

    transfer(opts: { to: { address: string, amount: number }[]; message?: string | undefined; }) {

    }

    buildTx(args: { inputs: { txId: string, vout: number }[], outputs: { address: string, amount: number }[] }) {
        let key = this._root.derive(this.getExternalPathIndex(0));
        const keyPair = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer());
        const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: this._network });

        const { inputs, outputs } = args;
        const builder = new bitcoin.TransactionBuilder(this._network);

        inputs.forEach(i => {
            builder.addInput(i.txId, i.vout, undefined, p2wpkh.output);
        });

        outputs.forEach(o => {
            builder.addOutput(o.address, o.amount);
        });
    }

    protected genAddress(key: HDPrivateKey) {
        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });

        return [p2wpkh.address!, p2pkh.address!,];
    }

    async genAddresses(from: number, to: number, external = true) {
        let address = (await this.getKeys(from, to, external)).map(key => this.genAddress(key));
        return linq(address).flatMap(a => a).toArray();
    }

    protected async discoverAddresses() {
        let addresses = await this.genAddresses(0, 10);
        let changes = await this.genAddresses(0, 5, false);
    }
}