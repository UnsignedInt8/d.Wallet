import * as compareVersions from 'compare-versions';
import axios from 'axios';
import { observable } from 'mobx';

const currentVersion = require('../../package.json').version as string;

class AppVersion {

    @observable updateAvailable = false;
    @observable latest = currentVersion;

    async check() {
        let resp = await axios.get('https://d-wallet.app/version.json');
        let data = resp.data;
        if (!data) return;
        let latest = data.ver;

        this.updateAvailable = compareVersions(latest, currentVersion) > 0;
        this.latest = latest;
    }
}

export default new AppVersion();