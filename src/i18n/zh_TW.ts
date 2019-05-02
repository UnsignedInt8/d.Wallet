const lang = {
    buttons: {
        cancel: '取消',
        ok: '確定',
        next: '下一步',
        send: '發送',
        close: '關閉',
    },

    welcome: {
        create: '新建',
        import: '導入',
        setPassword: '設置密碼 (必填，長度 ≥ 6)',
        password: '密碼',
        confirmPassword: '確認密碼',

        recover: {
            title: '導入錢包',
            typingMnemonic: '請輸入助記詞',
        },

        new: {
            title: '新建錢包',
            attention: '請保存好助記詞。如果丟失該助記詞，您將永久丟失您的資產，任何人都無法恢復。',
        }
    },

    sending: {
        address: '地址',
        amount: '數量',
        message: '寫點什麼東西...',
        fees: '手續費',
        send: '發送',
        cancel: '取消',
        building: '交易構建中，請稍後...'
    },

    receiving: {
        desc: (symbol: string) => `您的 ${symbol.toUpperCase()} 地址以及二維碼:`,
        address: '地址',
        segwit: 'Segwit',
        cashAddr: 'Bitcoin Cash 風格',
        legacy: '傳統風格',
    },

    settings: {
        autoLock: {
            title: '自動鎖',
            desc: '5分鐘後自動鎖上錢包 (Ctrl+Shift+L)',
        },
        languages: {
            title: '語言',
            system: '系統',
        },
        reset: {
            title: '重置錢包',
            desc: '重置全部數據',
        },
        paperKey: {
            title: '助記詞',
            desc: '查看與備份助記詞',
        },
        about: {
            title: '關於'
        }
    },

    lockScreen: {
        title: '錢包已鎖定',
    },

    txDetails: {
        title: '交易細節',
        hash: 'Hash',
        time: '時間',
        height: '區塊高度',
        fee: '手續費',
        from: '發送地址',
        to: '接收地址',
        amount: '數量',
        message: '消息',
    },

    paperKey: {
        title: '助記詞',
        backup: '助記詞是恢復加密資產的唯一方式，您應該妥善保管好該助記詞，請勿丟失',
        derivationPath: 'BIP 32 派生路徑',
    },

    reset: {
        title: '重置錢包',
        desc: '此操作將會重置全部數據，請備份好您的助記詞。',
    },

    about: {
        title: '關於',
        desc: '感謝使用 d.Wallet, d.Wallet 是一款加密貨幣輕錢包。目前它支持Bitcoin, Ethereum, Bitcoin Cash, Litecoin 以及 USDT。歡迎提出寶貴的意見與反饋。',
        thanks: '感謝',
        contact: '聯繫',
    },

    messages: {
        firstUseRelaunch: '感謝使用，程序正在配置中，請稍後...',
        invalidAddress: '存在接受方無效地址',
        noInternet: '請檢查網路並連接國際互聯網',
        broadcastTx: (hash: string) => `交易 ${hash} 已經成功廣播`,
        broadcastFailed: `廣播交易失敗，請檢查餘額並重試`,
        resetDone: '謝謝使用，稍後見...',
    }
}

export default lang;