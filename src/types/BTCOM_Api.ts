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

export interface Address {
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

export interface Unspent {
    tx_hash: string
    tx_output_n: number
    tx_output_n2: number
    value: number
    confirmations: number
}