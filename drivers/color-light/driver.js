'use strict';

const Homey = require('homey');
const check = require('../../lib/WizConnect');
const konst = require('../../lib/constants');


module.exports = class NewColorDriver extends Homey.Driver {

    /** 
     * onInit is called when the driver is initialized.
     */
    async onInit() {

        const showDimActionCard = this.homey.flow.getActionCard('color_dim');
        showDimActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowDimming(args, state));
        });

        const showTempActionCard = this.homey.flow.getActionCard('color_temperature');
        showTempActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowTemperature(args, state));
        });

        const showHueActionCard = this.homey.flow.getActionCard('color_hue');
        showHueActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowHue(args, state));
        });

        const showColorChartActionCard = this.homey.flow.getActionCard('color_color');
        showColorChartActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowColor(args, state));
        });

        const showSatActionCard = this.homey.flow.getActionCard('color_saturation');
        showSatActionCard.registerRunListener((args, state) => {
            return (args.device.setFlowSaturation(args, state));
        });

        const showColorActionCard = this.homey.flow.getActionCard('color-newsetcolor');
        showColorActionCard.registerRunListener((args, state) => {
            return (args.device.createColorScene(args, state));
        });
    }

    async onPair(session) {
        let devices = [];

        session.setHandler("get_devices", async (data) => {
            let CeD = new check();

            let devData = await CeD.connect(data.ipaddress, konst.LIGHT_COLOR);
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


};
