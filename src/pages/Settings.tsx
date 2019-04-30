import * as React from 'react';
import '../styles/Settings.scss';
const Switch = require("react-switch");
import PasswordMan from '../data/PasswordManager';
import { getAppSettings, AppSettings } from '../data/AppSettings';
import { getLang } from '../i18n';
import { observer } from 'mobx-react';
import Select from 'react-select';
import PaperKey from './PaperKey';
import AnimeHelper from '../lib/AnimeHelper';
import { Application } from '../Application';
import ResetBox from './ResetBox';
import sleep from 'sleep-promise';
import About from './About';
import MiscHelper from '../lib/MiscHelper';
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

type Pages = 'paperKey' | 'about' | 'reset';
interface State {
    expandedPage?: Pages;
}

@observer
export default class Settings extends React.Component<{}, State> {

    private appSettings = getAppSettings(PasswordMan.password)!!;
    private i18n = getLang(this.appSettings.lang);
    state: State = { expandedPage: undefined };

    private supportedLangs = [
        { value: 'en-US', label: 'English', },
        { value: 'zh-CN', label: '简体中文' },
        { value: '', label: this.i18n.settings.languages.system, }
    ]

    componentDidMount() {
        jquery('#app-lock-switch').focus().blur();
    }

    private switchAutoLock(on: boolean) {
        this.appSettings.autolock = on;
    }

    private changeLang(selected: any) {
        this.appSettings.lang = selected.value;
    }

    private openPage(page: Pages) {
        const open = () => this.setState({ expandedPage: page }, () => {
            AnimeHelper.expandPage('#settings-expanding-page', window.innerHeight, 0);
        });

        if (page === 'paperKey' || page === 'reset') {
            Application.lock(async () => {
                await sleep(3250);
                open();
            });
            return;
        }

        open();
    }

    private closePage() {
        AnimeHelper.expandPage('#settings-expanding-page', 0, window.innerHeight, () => this.setState({ expandedPage: undefined }));
    }

    private reset() {
        this.appSettings.delete();
        PasswordMan.delete();
        this.closePage();
        Application.notify({ message: this.i18n.messages.resetDone, appearance: 'success' });
        setTimeout(() => MiscHelper.relaunch(), 3000);
    }

    render() {
        return (
            <div id='settings'>
                <div className='setting-item no-drag' style={{ marginTop: '3.5vh' }}>
                    <div className='setting-title' onClick={_ => this.switchAutoLock(!this.appSettings.autolock)}>{this.i18n.settings.autoLock.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.autoLock.desc}</div>
                    <div className='setting-switch'>
                        <Switch
                            id='app-lock-switch'
                            className={`no-drag`}
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

                <div className='setting-item no-drag'>
                    <div className='setting-title'>{this.i18n.settings.languages.title}</div>
                    <div className='setting-detail no-drag'>
                        <Select onChange={e => this.changeLang(e)} options={this.supportedLangs} styles={selectColor} defaultValue={this.supportedLangs.filter(i => i.value === this.appSettings.lang)[0]} isClearable={false} isSearchable={false} />
                    </div>
                </div>

                <div className='setting-item no-drag'>
                    <div className='setting-title clickable no-drag' onClick={e => this.openPage('paperKey')}>{this.i18n.settings.paperKey.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.paperKey.desc}</div>
                </div>

                <div className='setting-item no-drag'>
                    <div className='setting-title clickable no-drag' onClick={_ => this.openPage('reset')}>{this.i18n.settings.reset.title}</div>
                    <div className='setting-detail'>{this.i18n.settings.reset.desc}</div>
                </div>

                <div className='setting-item no-drag'>
                    <div className='setting-title clickable no-drag' onClick={_ => this.openPage('about')}>{this.i18n.settings.about.title}</div>
                </div>

                {this.state.expandedPage ?
                    <div id='settings-expanding-page' onClick={_ => this.state.expandedPage === 'reset' ? this.closePage() : undefined}>
                        {this.state.expandedPage === 'paperKey' ? <PaperKey onClose={() => this.closePage()} /> : undefined}
                        {this.state.expandedPage === 'reset' ? <ResetBox onCancel={() => this.closePage()} onReset={() => this.reset()} /> : undefined}
                        {this.state.expandedPage === 'about' ? <About onCancel={() => this.closePage()} /> : undefined}
                    </div>
                    : undefined}

            </div>
        );
    }
}