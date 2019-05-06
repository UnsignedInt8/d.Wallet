const lang = {
    buttons: {
        cancel: 'キャンセル',
        ok: 'OK',
        next: '次に',
        send: '発信',
        close: '閉じる',
    },

    welcome: {
        create: '新規',
        import: 'インポート',
        setPassword: 'パスワードを設定する (必須)',
        password: 'パスワード',
        confirmPassword: 'パスワードを確認',

        recover: {
            title: 'インポート',
            typingMnemonic: 'ボックスにあなたのニーモニックフレーズを入力してください',
        },

        new: {
            title: '新規',
            attention: 'ニーモニックフレーズを保存して、スクリーンショットを撮らないでください。 あなたがニーモニックフレーズをなくした場合、誰でもあなたの資産にアクセスすることができます。',
        }
    },

    sending: {
        address: 'アドレス',
        amount: '量',
        message: 'ここに何か書いてください...',
        fees: '料金',
        send: '発信',
        cancel: 'キャンセル',
        balance: 'バランス',
        building: 'ビルディング、しばらくお待ちください...'
    },

    receiving: {
        desc: (symbol: string) => `あなたの ${symbol.toUpperCase()} アドレスとQR Code:`,
        address: 'アドレス',
        segwit: 'Segwit',
        cashAddr: 'Cash アドレス',
        legacy: '伝統的',
    },

    settings: {
        autoLock: {
            title: 'オートロック',
            desc: '5分後に自動的にアプリをロックする (Ctrl+Shift+L)',
        },
        languages: {
            title: '言語',
            system: 'システム',
        },
        reset: {
            title: 'リセット',
            desc: 'すべてのデータをリセット',
        },
        paperKey: {
            title: 'ニーモニックフレーズ',
            desc: 'あなたのニーモニックフレーズをバックアップする',
        },
        about: {
            title: '情報'
        }
    },

    lockScreen: {
        title: 'ロック解除',
    },

    txDetails: {
        title: '取引の詳細',
        hash: 'Hash',
        time: '時間',
        height: '高さ',
        fee: '料金',
        from: '送信者',
        to: '受取人',
        amount: '量',
        message: 'メッセージ',
    },

    paperKey: {
        title: 'ニーモニックフレーズ',
        backup: 'ニーモニックフレーズはあなたの暗号資産を復元する唯一の方法です。 あなたのニーモニックフレーズは書き留めて安全な場所に保管しておくべきです。',
        derivationPath: 'BIP 32 派生パス',
    },

    reset: {
        title: 'リセット',
        desc: 'これにより、すべてのデータがリセットされます。ニーモニックフレーズを保存していないと、すべての資産が失われます。',
    },

    about: {
        title: '情報',
        desc: 'ご利用いただきありがとうございます。 d.Walletはデスクトップユーザーのための軽量の暗号通貨ウォレットです。 暗号化資産を使用するためのセキュリティ環境とユーザーフレンドリーなインターフェースを提供します。 あなたはこのアプリが好きなら、あなたの友達に教えてください。',
        thanks: '感謝',
        contact: 'コンタクト',
    },

    messages: {
        firstUseRelaunch: 'ご利用いただきありがとうございます、アプリの設定中です...',
        invalidAddress: '無効なアドレスがいくつかあります',
        noInternet: 'インターネットが利用できない場合があります',
        broadcastTx: (hash: string) => `トランザクション ${hash} は正常にブロードキャストされました。`,
        broadcastFailed: `トランザクションをブロードキャストが失敗しました。残高を確認して、もう一度やり直してください。`,
        resetDone: 'ご利用いただきありがとうございます。　See you...',
        checkBalance: '残高を確認して、もう一度やり直してください',
    }
}

export default lang;