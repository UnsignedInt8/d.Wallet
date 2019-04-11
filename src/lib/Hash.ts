const createKeccakHash = require('keccak')
const crypto = require('crypto');
import rlp = require('rlp')

/**
 * Creates Keccak hash of the input
 * @param a The input data (Buffer|Array|String|Number)
 * @param bits The Keccak width
 */
export const keccak = function (a: Buffer, bits: number = 256): Buffer {

    if (!bits) bits = 256

    return createKeccakHash(`keccak${bits}`)
        .update(a)
        .digest()
}

/**
 * Creates Keccak-256 hash of the input, alias for keccak(a, 256).
 * @param a The input data (Buffer|Array|String|Number)
 */
export const keccak256 = function (a: any): Buffer {
    return keccak(a)
}

/**
 * Creates SHA256 hash of the input.
 * @param a The input data (Buffer|Array|String|Number)
 */
export const sha256 = function (a: Buffer): Buffer {
    return crypto.createHash('sha256')
        .update(a)
        .digest()
}

/**
 * Creates SHA-3 hash of the RLP encoded version of the input.
 * @param a The input data
 */
export const rlphash = function (a: rlp.Input): Buffer {
    return keccak(rlp.encode(a))
}
