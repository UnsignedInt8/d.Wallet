import * as React from 'react';
import './Password.scss';
const lock = require('../assets/padlock.svg');

interface Props {
    onChange: (value: string) => void;
}

export default class Password extends React.Component<Props, {}>{

    render() {
        return (
            <div id='password'>
                <input type="password" maxLength={32} onChange={e => this.props.onChange(e.target.value)} />
                <img src={lock} />
            </div>
        )
    }
}