const {shell} = require('electron');

export default class MiscHelper {

    static relaunch() {
        const remote = require('electron').remote;
        remote.app.relaunch();
        remote.app.exit(0);
    }

    static openLink(url: string) {
        shell.openExternal(url);
    }
}