const lang = {
    buttons: {
        cancel: '取消',
        ok: '确定',
        next: '下一步',
        send: '发送',
        close: '关闭',
    },

    welcome: {
        create: '新建',
        import: '导入',
        setPassword: '设置密码 (必填，长度 ≥ 6)',
        password: '密码',
        confirmPassword: '确认密码',

        recover: {
            title: '导入钱包',
            typingMnemonic: '请输入助记词',
        },

        new: {
            title: '新建钱包',
            attention: '请保存好助记词。如果丢失该助记词，您将永久丢失您的资产，任何人都无法恢复。',
        }
    },

    sending: {
        address: '地址',
        amount: '数量',
        message: '写点什么东西...',
        fees: '手续费',
        send: '发送',
        cancel: '取消',
        balance: '余额',
        building: '交易构建中，请稍后...'
    },

    receiving: {
        desc: (symbol: string) => `您的 ${symbol.toUpperCase()} 地址以及二维码:`,
        address: '地址',
        segwit: 'Segwit',
        cashAddr: 'Bitcoin Cash 风格',
        legacy: '传统风格',
    },

    settings: {
        autoLock: {
            title: '自动锁',
            desc: '5分钟后自动锁上钱包 (Ctrl+Shift+L)',
        },
        languages: {
            title: '语言',
            system: '系统',
        },
        reset: {
            title: '重置钱包',
            desc: '重置全部数据',
        },
        paperKey: {
            title: '助记词',
            desc: '查看与备份助记词',
        },
        about: {
            title: '关于'
        }
    },

    lockScreen: {
        title: '钱包已锁定',
    },

    txDetails: {
        title: '交易细节',
        hash: 'Hash',
        time: '时间',
        height: '区块高度',
        fee: '手续费',
        from: '发送地址',
        to: '接收地址',
        amount: '数量',
        message: '消息',
    },

    paperKey: {
        title: '助记词',
        backup: '助记词是恢复加密资产的唯一方式，您应该妥善保管好该助记词，请勿丢失',
        derivationPath: 'BIP 32 派生路径',
    },

    reset: {
        title: '重置钱包',
        desc: '此操作将会重置全部数据，请备份好您的助记词。',
    },

    about: {
        title: '关于',
        desc: '感谢使用 d.Wallet, d.Wallet 是一款加密货币轻钱包。目前它支持Bitcoin, Ethereum, Bitcoin Cash, Litecoin 以及 USDT。欢迎提出宝贵的意见与反馈。注意，中国用户可能需要连接国际互联网才能正常使用。',
        thanks: '感谢',
        contact: '联系',
        updateAvailable: (ver: string) => `有更新可升级: ${ver}`,
    },

    messages: {
        firstUseRelaunch: '感谢使用，程序正在配置中，请稍后...',
        invalidAddress: '存在接受方无效地址',
        noInternet: '请检查网络并连接国际互联网',
        broadcastTx: (hash: string) => `交易 ${hash} 已经成功广播`,
        broadcastFailed: `广播交易失败，请检查余额并重试`,
        resetDone: '谢谢使用，稍后见...',
        checkBalance: '请检查您的余额',
        cameraNotAvailable: '摄像头不可用，请检查后重试',

    }
}

export default lang;