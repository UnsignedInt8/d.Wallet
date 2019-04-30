import * as React from 'react';
import * as QRCode from 'qrcode.react';
import '../styles/Receive.scss';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import Select from 'react-select';
import { observer } from 'mobx-react';
import * as jquery from 'jquery';

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
    selectedType: number;
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

    state: State = { selectedIndex: 0, selectedType: 0 };

    componentDidMount() {
        jquery('#win-hook').focus();
    }

    private onAddressChanged(selected: any) {
        this.setState({ selectedIndex: selected.index });
    }

    render() {
        const appSettings = getAppSettings(PassMan.password);
        const i18n = appSettings.i18n;
        const addresses = this.props.addresses ? this.props.addresses.map((value, index) => { return { index, value, label: value[0] } }) : [];
        const selectedAddress = addresses[this.state.selectedIndex] || addresses[0] || { index: 0, value: [this.props.address], label: this.props.address };

        const address = selectedAddress.value.length > 1 ? selectedAddress.value[this.state.selectedType] : selectedAddress.value[0];
        const qrValue = `${coins[this.props.symbol].toLowerCase().replace(' ', '')}:${address}`;

        return (
            <div id='receiving' className='lato' >

                <button id='win-hook' style={{ opacity: 0, display: 'hidden', position: 'absolute', bottom: 0, width: 0, height: 0 }}></button>

                <div id='info' className=''>
                    {i18n.receiving.desc(this.props.symbol.toUpperCase())}
                    <div id='selection'>
                        <Select onChange={e => this.onAddressChanged(e)} styles={selectColor} options={addresses} isClearable={false} isSearchable={false} value={selectedAddress} defaultValue={addresses[0]} />
                    </div>
                    <div id='address'>
                        {address}
                    </div>
                    {this.props.symbol === 'btc' ?
                        <div id='address-type' className='no-drag'>
                            <div className={`radio no-drag ${this.state.selectedType === 0 ? 'selected' : ''}`} onClick={_ => this.setState({ selectedType: 0 })}>{i18n.receiving.segwit}</div>
                            <div className={`radio ${this.state.selectedType === 1 ? 'selected' : ''}`} onClick={_ => this.setState({ selectedType: 1 })}>{i18n.receiving.legacy}</div>
                        </div>
                        : undefined
                    }
                    {this.props.symbol === 'bch' ?
                        <div id='address-type' className='no-drag'>
                            <div className={`radio no-drag ${this.state.selectedType === 0 ? 'selected' : ''}`} onClick={_ => this.setState({ selectedType: 0 })}>{i18n.receiving.cashAddr}</div>
                            <div className={`radio no-drag ${this.state.selectedType === 1 ? 'selected' : ''}`} onClick={_ => this.setState({ selectedType: 1 })}>{i18n.receiving.legacy}</div>
                        </div>
                        : undefined
                    }
                </div>
                <div id='qrcode'>
                    <div id='qrcode-container'>
                        <div id='title'>
                            <span>{coins[this.props.symbol]} {i18n.receiving.address}</span>
                        </div>
                        <QRCode value={qrValue} level='M' bgColor='transparent' fgColor='white' size={125} />
                    </div>
                </div>
            </div>
        );
    }
}