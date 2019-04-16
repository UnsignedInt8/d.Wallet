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

export interface BTCTxObject {
    data: IBTCTxData;
    context: Context;
}

interface IBTCTxData {
    [index: string]: BTCTx;
}

interface BTCTx {
    transaction: Transaction;
    inputs: Input[];
    outputs: Input[];
}

interface Input {
    block_id: number;
    transaction_id: number;
    index: number;
    transaction_hash: string;
    date: string;
    time: string;
    value: number;
    value_usd: number;
    recipient: string;
    type: string;
    script_hex: string;
    is_from_coinbase: boolean;
    is_spendable?: any;
    is_spent: boolean;
    spending_block_id: number;
    spending_transaction_id: number;
    spending_index: number;
    spending_transaction_hash: string;
    spending_date: string;
    spending_time: string;
    spending_value_usd: number;
    spending_sequence: number;
    spending_signature_hex: string;
    spending_witness: string;
    lifespan: number;
    cdd: number;
}

interface Transaction {
    block_id: number;
    id: number;
    hash: string;
    date: string;
    time: string;
    size: number;
    weight: number;
    version: number;
    lock_time: number;
    is_coinbase: boolean;
    has_witness: boolean;
    input_count: number;
    output_count: number;
    input_total: number;
    input_total_usd: number;
    output_total: number;
    output_total_usd: number;
    fee: number;
    fee_usd: number;
    fee_per_kb: number;
    fee_per_kb_usd: number;
    fee_per_kwu: number;
    fee_per_kwu_usd: number;
    cdd_total: number;
}

export interface ETHTxObject {
    data: IETHTxData;
    context: Context;
}

interface IETHTxData {
    [index: string]: IETHTx,
}

interface IETHTx {
    address: ETHAddress;
    calls: Call[];
}

interface Call {
    block_id: number;
    transaction_hash: string;
    index: string;
    time: string;
    sender: string;
    recipient: string;
    value: string;
    value_usd: number;
    transferred: boolean;
}

interface ETHAddress {
    type: string;
    contract_code_hex?: any;
    contract_created?: any;
    contract_destroyed?: any;
    balance?: string;
    balance_usd: number;
    received_approximate: string;
    received_usd: number;
    spent_approximate: string;
    spent_usd: number;
    fees_approximate: string;
    fees_usd: number;
    receiving_call_count: number;
    spending_call_count: number;
    call_count: number;
    transaction_count: number;
    first_seen_receiving: string;
    last_seen_receiving: string;
    first_seen_spending: string;
    last_seen_spending: string;
}