import * as React from 'react';
import '../styles/Settings.scss';
const Switch = require("react-switch");

interface State {
    autoLock: boolean;
}

export default class Settings extends React.Component<{}, State> {

    constructor(props, context) {
        super(props, context);
        this.state = { autoLock: false }
    }

    private switchAutoLock(on: boolean) {
        this.setState({ autoLock: on });
    }

    render() {
        return (
            <div id='settings'>
                <div className='setting-item'>
                    <div className='setting-title' onClick={_ => this.switchAutoLock(!this.state.autoLock)}>Auto Lock</div>
                    <div className='setting-desc'>Automatically lock app after 5 minutes</div>
                    <div className='setting-switch'>
                        <Switch
                            checked={this.state.autoLock}
                            onChange={checked => this.switchAutoLock(checked)}
                            onColor="#c2ff86"
                            onHandleColor="#ace625"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48} />
                    </div>
                </div>
            </div>
        );
    }
}