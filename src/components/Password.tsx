import * as React from 'react';
import './Password.scss';
import * as jquery from 'jquery';

const lock = require('../assets/padlock.svg');

interface Props {
    onChange: (value: string) => void;
    style?: React.CSSProperties,
    inputStyle?: React.CSSProperties,
}

export default class Password extends React.Component<Props, {}>{

    private pwInput!: HTMLInputElement;

    clean() {
        this.pwInput.value = '';
    }

    componentDidMount() {
        setTimeout(() => jquery('input[type=password]').focus(), 2000);
    }

    render() {
        return (
            <div className='password' style={this.props.style}>
                <input ref={e => this.pwInput = e!} type="password" maxLength={32} onChange={e => this.props.onChange(e.target.value)} style={this.props.inputStyle} />
                <img src={lock} />
            </div>
        )
    }
}