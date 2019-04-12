export interface BTCAddressObject {
    data: IAddress;
    context: Context;
}

interface Context {
    code: number;
    source: string;
    time: number;
    limit: number;
    offset: number;
    results: number;
    state: number;
    cache: Cache;
    api: Api;
}

interface Api {
    version: string;
    last_major_update: string;
    next_major_update?: any;
    tested_features: string;
    documentation: string;
}

interface Cache {
    live: boolean;
    duration: number;
    since: string;
    until: string;
    time?: any;
}

interface IAddress {
    [index: string]: Address;
}

interface Address {
    address: Address_Details;
    transactions: string[];
}

interface Address_Details {
    type: string;
    script_hex: string;
    balance: number;
    balance_usd: number;
    received: number;
    received_usd: number;
    spent: number;
    spent_usd: number;
    output_count: number;
    unspent_output_count: number;
    first_seen_receiving: string;
    last_seen_receiving: string;
    first_seen_spending: string;
    last_seen_spending: string;
    transaction_count: number;
}