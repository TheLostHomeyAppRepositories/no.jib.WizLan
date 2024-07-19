'use strict';

const { Driver } = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');

let ipadr = "";

class ColorDriver extends Driver {

    /** 
     * onInit is called when the driver is initialized.
     */
    async onInit() {

        const showColScnActionCard = this.homey.flow.getActionCard('color setdim');
        showColScnActionCard.registerRunListener((args, state) => {
             return (args.device.createDimming(args, state));
        });

        const showColorActionCard = this.homey.flow.getActionCard('color setcolor');
        showColorActionCard.registerRunListener((args, state) => {
            return (args.device.createColorScene(args, state));
        });
    }

    async onPair(session) {
        var devices = [];

        session.setHandler("get_devices", async (data, callback) => {
            var CeD = new check();

            var devData = await CeD.connect(data.ipaddress, konst.LIGHT_COLOR);
            if (devData != null) {
                var deviceDescriptor = {
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
                    "capabilities": ["onoff", "dim", "light_hue", "light_saturation", "light_temperature", "light_mode", "colorscene"]
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


}

module.exports = ColorDriver;
