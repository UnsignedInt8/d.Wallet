import * as React from 'react';
import '../styles/Settings.scss';
const Switch = require("react-switch");
import PasswordMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import { getLang } from '../i18n';
import { observer } from 'mobx-react';
import Select from 'react-select';

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

@observer
export default class Settings extends React.Component<{}, {}> {

    private appSettings = getAppSettings(PasswordMan.password)!!;
    private i18n = getLang(this.appSettings.lang);


    private supportedLangs = [
        { value: 'en-US', label: 'English', },
        { value: '', label: this.i18n.settings.languages.system, }
    ]

    private switchAutoLock(on: boolean) {
        this.appSettings.autolock = on;
    }

    private changeLang(selected: any) {
        this.appSettings.lang = selected.value;
    }

    render() {
        return (
            <div id='settings'>
                <div className='setting-item'>
                    <div className='setting-title' onClick={_ => this.switchAutoLock(!this.appSettings.autolock)}>{this.i18n.settings.autoLock.title}</div>
                    <div className='setting-detail'>Automatically lock app after 5 minutes</div>
                    <div className='setting-switch'>
                        <Switch
                            checked={this.appSettings.autolock}
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

                <div className='setting-item'>
                    <div className='setting-title'>{this.i18n.settings.languages.title}</div>
                    <div className='setting-detail'>
                        <Select onChange={e => this.changeLang(e)} options={this.supportedLangs} styles={selectColor} defaultValue={this.supportedLangs.filter(i => i.value === this.appSettings.lang)[0]} isClearable={false} isSearchable={false} />
                    </div>
                </div>

            </div>
        );
    }
}