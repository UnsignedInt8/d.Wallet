const lang = {
    buttons: {
        cancel: 'Cancel',
        ok: 'OK',
        next: 'Next',
        send: 'Send',
    },

    welcome: {
        create: 'Create',
        import: 'Import',
        setPassword: 'Set a Password (Required)',
        password: 'Password',
        confirmPassword: 'Confirm Password',

        recover: {
            title: 'Import Wallet',
            typingMnemonic: 'Please typing your Mnemonic Phrase in the box',
        },

        new: {
            title: 'New Wallet',
            attention: 'Please save the Mnemonic Phrase safely, and do not take a screenshot. Anyone may have access to your assets if you lose the Mnemonic Phrase',
        }
    },

    sending: {
        address: 'Address',
        amount: 'Amount',
        message: 'Message',
        fees: 'Fees',
        send: 'Send',
        cancel: 'Cancel',
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
            desc: 'Automatically lock app after 5 minutes',
        },
        languages: {
            title: 'Languages',
            system: 'System',
        },
    },

    lockScreen: {
        title: 'Unlock Your Wallet',
    }
}

export default lang;