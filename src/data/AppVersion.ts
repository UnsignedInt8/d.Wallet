import * as compareVersions from 'compare-versions';
import axios from 'axios';
import { observable } from 'mobx';

const currentVersion = require('../../package.json').version as string;

class AppVersion {

    @observable updateAvailable = false;

    async check() {
        let resp = await axios.get('https://d-wallet.app/version.json');
        let data = resp.data;
        if (!data) return;
        let lastest = data.ver;

        this.updateAvailable = compareVersions(lastest, currentVersion) > 0;
    }
}

export default new AppVersion();