
export interface OmniAddress {
    balance: Balance2[];
}

interface Balance2 {
    divisible: boolean;
    frozen?: string;
    id: string;
    pendingneg: string;
    pendingpos: string;
    propertyinfo: Propertyinfo2;
    reserved?: string;
    symbol: string;
    value: string;
    error?: boolean;
}

interface Propertyinfo2 {
    amount?: string;
    block?: number;
    blockhash?: string;
    blocktime: number;
    category?: string;
    confirmations?: number;
    creationtxid?: string;
    data: string;
    divisible: boolean;
    ecosystem?: string;
    fee?: string;
    fixedissuance?: boolean;
    flags: Flags2;
    freezingenabled?: boolean;
    ismine?: boolean;
    issuer: string;
    managedissuance?: boolean;
    name: string;
    positioninblock?: number;
    propertyid: number;
    propertyname?: string;
    propertytype?: string;
    rdata?: any;
    registered: boolean;
    sendingaddress?: string;
    subcategory?: string;
    totaltokens: string;
    txid?: string;
    type?: string;
    type_int?: number;
    url: string;
    valid?: boolean;
    version?: number;
}

interface Flags2 {
    duplicate?: boolean;
    scam?: boolean;
}


export interface OmniAddressTx {
    address: string;
    current_page: number;
    pages: number;
    transactions: Transaction[];
}

interface Transaction {
    amount: string;
    block: number;
    blockhash: string;
    blocktime: number;
    confirmations: number;
    divisible: boolean;
    fee: string;
    flags?: any;
    ismine: boolean;
    positioninblock: number;
    propertyid: number;
    propertyname: string;
    referenceaddress: string;
    sendingaddress: string;
    txid: string;
    type: string;
    type_int: number;
    valid: boolean;
    version: number;
}