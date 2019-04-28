import * as React from 'react';
import './Password.scss';
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

    render() {
        return (
            <div className='password' style={this.props.style}>
                <input ref={e => this.pwInput = e!} type="password" maxLength={32} onChange={e => this.props.onChange(e.target.value)} style={this.props.inputStyle} />
                <img src={lock} />
            </div>
        )
    }
}