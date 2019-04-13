import * as React from 'react';
import * as QRCode from 'qrcode.react';
import '../styles/Receive.scss';
import { getLang } from '../i18n';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import Select from 'react-select';
import { observer } from 'mobx-react';
import { Flip, Fade } from 'react-reveal';

const selectColor = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
    }),
    container: (base, state) => ({
        ...base,
        marginTop: 8,
        outline: 'none',
    })
};

interface Props {
    address: string;
    addresses?: string[][];
    symbol: string;
    onCancel: () => void;
}

interface State {
    selectedIndex: number;
}

const coins: { [index: string]: string } = {
    'btc': 'Bitcoin',
    'eth': 'Ethereum',
    'bch': 'Bitcoin Cash',
    'ltc': 'Litecoin',
    'usdt': 'USDT'
};

@observer
export default class Receive extends React.Component<Props, State>{

    state: State = { selectedIndex: 0, };

    private onAddressChanged(selected: any) {
        this.setState({ selectedIndex: selected.index });
    }

    render() {
        const appSettings = getAppSettings(PassMan.password);
        const i18n = getLang(appSettings.lang);
        const addresses = this.props.addresses ? this.props.addresses.map((value, index) => { return { index, value, label: value[0] } }) : [];
        const selectedAddress = addresses[this.state.selectedIndex] || addresses[0] || { index: 0, value: [this.props.address], label: this.props.address };
        const qrValue = `${coins[this.props.symbol].toLowerCase().replace(' ', '')}:${selectedAddress.value[0]}`;

        return (
            <div id='receiving' className='lato-bold' >
                <div id='info'>
                    {i18n.receiving.desc(this.props.symbol.toUpperCase())}
                    <div id='selection'>
                        <Select onChange={e => this.onAddressChanged(e)} styles={selectColor} options={addresses} isClearable={false} isSearchable={false} value={selectedAddress} defaultValue={addresses[0]} />
                    </div>
                    <div id='address'>
                        {selectedAddress.value[0]}
                    </div>
                </div>
                <div id='qrcode'>
                    <div id='qrcode-container'>
                        <div id='title'>
                            <span>{coins[this.props.symbol]} {i18n.receiving.address}</span>
                        </div>
                        <QRCode value={qrValue} level='M' bgColor='transparent' fgColor='white' />
                    </div>
                </div>
            </div>
        );
    }
}