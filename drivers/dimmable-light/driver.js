'use strict';

const Homey = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');


module.exports = class NewDimmableDriver extends Homey.Driver {

    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {

        const showDimActionCard = this.homey.flow.getActionCard('dimmable_dim');
        showDimActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowDimming(args, state));
        });
    }

    async onPair(session) {
        let devices = [];

        session.setHandler("get_devices", async (data, callback) => {
            let CeD = new check();

            let devData = await CeD.connect(data.ipaddress, konst.LIGHT_DIMMABLE);
            if (devData != null) {
                let deviceDescriptor = {
                    "name": data.deviceName,
                    "data": {
                        "id": devData.id,
                        "ipadr": devData.ipadr,
                        "macadr": devData.macadr
                    },
                    "settings": {
                        "ip": devData.ipadr,
                        "mac": devData.macadr
                    },
                    "capabilities": ["onoff", "dim"]
                };
                devices.push(deviceDescriptor);
                session.emit("found", null);
            } else {
                session.emit("not_found", null);
            }
        });

        session.setHandler("list_devices", function (data, callback) {
            return devices;
        });
    }


    async onPairListDevices() {
        return [];
    }

};
