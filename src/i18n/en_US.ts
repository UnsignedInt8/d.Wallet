const lang = {
    buttons: {
        cancel: 'Cancel',
    },
    welcome: {
        create: 'Create',
        import: 'Import',
        recover: {
            title: 'Import Wallet',
            typingMnemonic: 'Please typing your Mnemonic Phrase in the box',
            setPassword: 'Set a Password (Required)',
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
        desc: (symbol: string) => `Your ${symbol.toUpperCase()} address and QR Code:`,
        address: 'Address',
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
    }
}

export default lang;