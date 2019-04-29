export default class MiscHelper {

    static relaunch() {
        const remote = require('electron').remote;
        remote.app.relaunch();
        remote.app.exit(0);
    }
}