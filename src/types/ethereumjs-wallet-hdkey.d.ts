
declare module "ethereumjs-wallet/hdkey" {

    import Wallet from "ethereumjs-wallet";

    export default class HDKey {

        static fromMasterSeed(seed: string): HDKey;
        static fromExtendedKey(key: string): HDKey;

        privateExtendedKey(): string;
        publicExtendedKey(): string;
        derivePath(path: string): HDKey;

        getWallet(): Wallet;
    }
}