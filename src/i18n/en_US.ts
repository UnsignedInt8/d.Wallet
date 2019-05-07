const lang = {
    buttons: {
        cancel: 'Cancel',
        ok: 'OK',
        next: 'Next',
        send: 'Send',
        close: 'Close',
    },

    welcome: {
        create: 'Create',
        import: 'Import',
        setPassword: 'Set a Password (Required)',
        password: 'Password',
        confirmPassword: 'Confirm Password',

        recover: {
            title: 'Import Wallet',
            typingMnemonic: 'Please typing your Mnemonic Phrases in the box',
        },

        new: {
            title: 'New Wallet',
            attention: 'Please save the Mnemonic Phrases, and do not take a screenshot. Anyone may have access to your assets if you lose the Mnemonic Phrases.',
        }
    },

    sending: {
        address: 'Address',
        amount: 'Amount',
        message: 'Write something here...',
        fees: 'Fees',
        send: 'Send',
        cancel: 'Cancel',
        balance: 'Balance',
        building: 'Building, please wait a moment...'
    },

    receiving: {
        desc: (symbol: string) => `Your ${symbol.toUpperCase()} addresses and QR Code:`,
        address: 'Address',
        segwit: 'Segwit',
        cashAddr: 'Cash Address',
        legacy: 'Legacy',
    },

    settings: {
        autoLock: {
            title: 'Auto Lock',
            desc: 'Automatically lock app after 5 minutes (Ctrl+Shift+L)',
        },
        languages: {
            title: 'Languages',
            system: 'System',
        },
        reset: {
            title: 'Reset',
            desc: 'Reset all your data',
        },
        paperKey: {
            title: 'Paper Key',
            desc: 'Backup your mnemonic phrases',
        },
        about: {
            title: 'About'
        }
    },

    lockScreen: {
        title: 'Unlock Your Wallet',
    },

    txDetails: {
        title: 'Transaction Details',
        hash: 'Hash',
        time: 'Time',
        height: 'Height',
        fee: 'Fee',
        from: 'From',
        to: 'To',
        amount: 'Amount',
        message: 'Message',
    },

    paperKey: {
        title: 'Paper Key',
        backup: 'The mnemonic phrases is the only way to restore your crypto assets. You should have your mnemonic phrases written down and stored in a safe place.',
        derivationPath: 'BIP 32 Derivation Path',
    },

    reset: {
        title: 'Reset',
        desc: 'This will reset all your data, if you have not saved your paper key, you will lose all your assets.',
    },

    about: {
        title: 'About',
        desc: 'Thanks for using. d.Wallet is a light cryptocurrency wallet for Desktop users. It provides a security environment and user-friendly interface for using crypto assets. If you like this app, please tell your friends.',
        thanks: 'Thanks',
        contact: 'Contact',
        updateAvailable: (ver: string) => `Update Available: ${ver}`,
    },

    messages: {
        firstUseRelaunch: 'Thanks for using, app is configuring, see you later...',
        invalidAddress: 'There are some invalid addresses.',
        noInternet: 'Internet may not available.',
        broadcastTx: (hash: string) => `Transaction ${hash} has been successfully broadcasted.`,
        broadcastFailed: `Broadcasting transaction failed, check your balance, and try again.`,
        resetDone: 'Thanks for using, see you later.',
        checkBalance: 'Check your balance, and try again.',
        cameraNotAvailable: 'Camera may not available',
    }
}

export default lang;