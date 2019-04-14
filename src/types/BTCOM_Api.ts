export interface Transaction {
    block_height: number
    block_time: number
    created_at: number
    fee: number
    hash: string
    inputs: [
        {
            "prev_addresses": Array<String>
            "prev_position": number
            "prev_tx_hash": string
            "prev_value": number
            "script_asm": string
            "script_hex": string
            "sequence": number
        },
    ],
    inputs_count: number
    inputs_value: number
    is_coinbase: boolean
    lock_time: number
    outputs: [
        {
            addresses: Array<String>
            value: number
        }
    ],
    outputs_count: number
    outputs_value: number
    size: number
    version: number
};

export interface BTCOMAddress {
    address: string
    received: number
    sent: number
    balance: number
    tx_count: number
    unconfirmed_tx_count: number
    unconfirmed_received: number
    unconfirmed_sent: number
    unspent_tx_count: number
}

interface Unspent {
    tx_hash: string
    tx_output_n: number
    tx_output_n2: number
    value: number
    confirmations: number
}

export interface BTCOMAddressTx {
    total_count: number;
    page: number;
    pagesize: number;
    list: BTCOMTx[];
}

export interface BTCOMTx {
    confirmations: number;
    block_height: number;
    block_hash: string;
    block_time: number;
    created_at: number;
    fee: number;
    hash: string;
    inputs_count: number;
    inputs_value: number;
    is_coinbase: boolean;
    is_double_spend: boolean;
    is_sw_tx: boolean;
    weight: number;
    vsize: number;
    witness_hash: string;
    lock_time: number;
    outputs_count: number;
    outputs_value: number;
    size: number;
    sigops: number;
    version: number;
    inputs: Input[];
    outputs: Output[];
    balance_diff: number;
}

interface Output {
    addresses: string[];
    value: number;
    type: string;
    spent_by_tx?: string | string;
    spent_by_tx_position: number;
}

interface Input {
    prev_addresses: string[];
    prev_position: number;
    prev_tx_hash: string;
    prev_type: string;
    prev_value: number;
    sequence: number;
}