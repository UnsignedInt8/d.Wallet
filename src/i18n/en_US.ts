const lang = {
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
        languages: 'Languages',
    }
}

export default lang;