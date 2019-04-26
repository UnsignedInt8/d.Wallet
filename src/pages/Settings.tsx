import * as React from 'react';
import '../styles/Settings.scss';
const Switch = require("react-switch");
import PasswordMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import { getLang } from '../i18n';
import { observer } from 'mobx-react';
import Select from 'react-select';
import PaperKey from './PaperKey';
import AnimeHelper from '../lib/AnimeHelper';
import Application from '../Application';

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

type Pages = 'paperKey' | 'about';
interface State {
    expandedPage?: Pages;
}

@observer
export default class Settings extends React.Component<{}, State> {

    private appSettings = getAppSettings(PasswordMan.password)!!;
    private i18n = getLang(this.appSettings.lang);
    state: State = {};

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

    private openPage(page: Pages) {
        if (page === 'paperKey') Application.lock();

        this.setState({ expandedPage: page }, () => {
            AnimeHelper.expandPage('#settings-expanding-page', window.innerHeight, 0);
        });
    }

    private closePage() {
        AnimeHelper.expandPage('#settings-expanding-page', 0, window.innerHeight, () => this.setState({ expandedPage: undefined }));
    }

    render() {
        return (
            <div id='settings'>
                <div className='setting-item' style={{ marginTop: '3.5vh' }}>
                    <div className='setting-title' onClick={_ => this.switchAutoLock(!this.appSettings.autolock)}>{this.i18n.settings.autoLock.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.autoLock.desc}</div>
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

                <div className='setting-item' onClick={e => this.openPage('paperKey')}>
                    <div className='setting-title clickable'>{this.i18n.settings.paperKey.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.paperKey.desc}</div>
                </div>

                <div className='setting-item'>
                    <div className='setting-title clickable'>{this.i18n.settings.reset.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.reset.desc}</div>
                </div>

                <div className='setting-item'>
                    <div className='setting-title clickable'>{this.i18n.settings.about.title}</div>
                </div>

                {this.state.expandedPage ?
                    <div id='settings-expanding-page'>
                        {this.state.expandedPage === 'paperKey' ? <PaperKey onClose={() => this.closePage()} /> : undefined}

                    </div>
                    : undefined}

            </div>
        );
    }
}