import axios from 'axios';

export type Coins = 'btc' | 'eth' | 'bch' | 'usdt' | 'ltc';

export default class CoinRanking {

    static readonly coins = {
        'btc': 1,
        'eth': 2,
        'bch': 4,
        'usdt': 8,
        'ltc': 7
    }

    static async fetchHistory(coin: Coins, during: '24h' | '7d' | '30d' | '1y' | '5y' = '30d') {
        let result = await axios.get(`https://api.coinranking.com/v1/public/coin/${this.coins[coin]}/history/${during}?base=usd`);
        let data = result.data;
        if (!data || data.status !== 'success') return null;
        return data.data.history as { price: string, timestamp: number }[];
    }

    static async fetchPrice(coin: Coins) {
        let result = await axios.get(`https://api.coinranking.com/v1/public/coin/${this.coins[coin]}`);
        let data = result.data;
        if (!data || data.status !== 'success') return null;
        return data.data.coin as { price: string, change: number };
    }
}