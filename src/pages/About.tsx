import * as React from 'react';
import '../styles/About.scss';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';

export default class About extends React.Component {

    i18n = getAppSettings(PassMan.password).i18n;

    render() {
        return (
            <div id='about-page'>
                <div className='page-title'>
                    {this.i18n.about.title}
                </div>

                
            </div>
        );
    }
}