
declare module "ethereumjs-wallet" {
    export default class Wallet {

        static fromPrivateKey(key: string): Wallet;
        static fromExtendedPrivateKey(key: string): Wallet;
        static fromPublicKey(key: string, nonStrict?: boolean): Wallet;
        static fromExtendedPublicKey(key: string): Wallet;
        static fromV1(keystore: string, pw: string): Wallet;
        static fromV3(keystore: string, pw: string): Wallet;

        getPrivateKey(): Buffer;
        getPrivateKeyString(): string;
        getPublicKey(): Buffer;
        getPublicKeyString(): string;
        getAddress(): Buffer;
        getAddressString(): string;
    }
}
