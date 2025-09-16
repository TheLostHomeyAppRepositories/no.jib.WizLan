'use strict';

const Homey = require('homey');
// const tinycolor = require('tinycolor2');
const util = require('util');
const ColUtill = require('../../lib/colorutil');
const Command = require('../../lib/WizCommand');

module.exports = class NewColorDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        const id = this.getData('id');
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        let devices = new Command();

        let isState = await devices.getState(ipAddr);
        this.setCapabilityValue('onoff', isState);
        this.registerCapabilityListener('onoff', async (value) => {
            let devicec = new Command();
            const settings = this.getSettings();
            await devicec.setOnOff(settings.ip, value);
        });
        this.registerMultipleCapabilityListener(['light_hue', 'light_saturation'], this.onCapabilityLight.bind(this), 200);
        this.registerMultipleCapabilityListener(['dim', 'light_mode', 'light_temperature'], this.onCapabilityLight.bind(this));

        let mydim = await devices.getDimming(ipAddr);
        this.setCapabilityValue('dim', mydim / 100);

        let kelvindata = await devices.getTemperature(settings.ip);
        let temp = (100 - ((kelvindata * 100) / 4500));
        this.setCapabilityValue('light_temperature', temp);

        let rbgdata = await devices.getRGB(ipAddr);
        let hsvdata = ColUtill.rgb2hsv(rbgdata[0], rbgdata[1], rbgdata[2]);
        this.setCapabilityValue('light_hue', hsvdata[0] / 360);
        this.setCapabilityValue('light_saturation', hsvdata[1] / 100);

        let sce = await devices.getScene(ipAddr);
        this.registerCapabilityListener('colorscene', async (value) => {
            let sce = parseInt(value);
            let devicec = new Command();
            const settings = this.getSettings();
            if (sce == 0) {
                sce = 0;
                await devicec.setLightTemp(settings.ip, 2700);
            } else {
                await devicec.setLightScene(settings.ip, sce);
            }
        });

        this.pollDevice();
    }

    /**
     * Helping function for capability listner for color lamps
     */

    async onCapabilityLight({
        dim = this.getCapabilityValue('dim'),
        onoff = this.getCapabilityValue('onoff'),
        light_hue = this.getCapabilityValue('light_hue'),
        light_saturation = this.getCapabilityValue('light_saturation'),
        light_mode = this.getCapabilityValue('light_mode'),
        light_temperature = this.getCapabilityValue('light_temperature'),
    } = {}) {
        let devicec = new Command();
        const settings = this.getSettings();

        if (onoff === false) {
            await this.setCapabilityValue('onoff', true);
            await devicec.setOnOff(settings.ip, true);
        }

        if (!dim || dim === 0) {
            await this.setCapabilityValue('dim', 1);
            dim = 1;
            await devicec.setBrightness(settings.ip, dim * 100);
       } else {
            if (light_mode == 'color') {
                const { r, g, b } = ColUtill.hsv2rgb2(light_hue, light_saturation, dim * 100);
                await devicec.setColorRGB(settings.ip, r, g, b);
            } else {
                await devicec.setBrightness(settings.ip, dim*100);
            }
        }


        if (light_mode === 'temperature') {
            await this.setCapabilityValue('light_mode', 'temperature');
            let tmp = light_temperature;
            let atemp = (1 - tmp) * (6500 - 2000) + 2000;
            await devicec.setLightTemp(settings.ip, atemp);
        }

        if (light_mode === 'color' || light_mode === null) {
            if ((light_hue == 0) && (light_saturation == 0)) {
                let com = 0;
            } else {
                await this.setCapabilityValue('light_mode', 'color');
                const { r, g, b } = ColUtill.hsv2rgb2(light_hue, light_saturation, dim*100);
                await devicec.setColorRGB(settings.ip, r, g, b);
            }
        };
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('WizColor has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        this.log('WizColor device settings changed (IP) ' + ipAddr);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     */
    async onRenamed(name) {
        this.log('WizColor device was renamed to ' + name);
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        clearInterval(this.pollingInterval);
    }

    // FLOW functions

    async setFlowDimming(args) {
        if (args.hasOwnProperty('wdim')) {
            let devices = new Command();
            const settings = this.getSettings();
            let val = args.wdim;
            this.setCapabilityValue('dim', val / 100);
            await devices.setBrightness(settings.ip, val);
        }
    }


    async setFlowTemperature(args) {
        if (args.hasOwnProperty('wtemperature')) {
            let devices = new Command();
            const settings = this.getSettings();
            let val = args.wtemperature;
            let temp = ((val * 100) / 4500);
            this.setCapabilityValue('light_temperature', temp);
            await devices.setLightTemp(settings.ip, val);
        }
    }

    async setFlowHue(args) {
        if (args.hasOwnProperty('hue')) {
            let sat = this.getCapabilityValue('light_hue');
            let lig = this.getCapabilityValue('dim');
            let hue = args.hue;
            const { r, g, b } = ColUtill.hsv2rgb(hue, sat, lig);
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setColorRGB(settings.ip, r, g, b);
        }
    }

    async setFlowColor(args) {
        if (args.hasOwnProperty('color')) {
            let hex = args.color;
            const { r, b, g } = ColUtill.hex2rgb(hex);
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setColorRGB(settings.ip, r, g, b);
            const { h, s, v } = ColUtill.rgb2hsv(r, g, b);
            await this.setCapabilityValue('light_hue', h / 360);
            await this.setCapabilityValue('light_saturation', v / 100);
        }
    }

    async setFlowSaturation(args) {
        if (args.hasOwnProperty('saturation')) {
            let hue = this.getCapabilityValue('light_hue');
            let lig = this.getCapabilityValue('dim');
            let sat = args.saturation;
            const { r, g, b } = ColUtill.hsv2rgb(hue, sat, lig);
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setColorRGB(settings.ip, r, g, b);
        }
    }

    async createColorScene(args) {
        if (args.hasOwnProperty('colorscene')) {
            let devices = new Command();
            const settings = this.getSettings();
            let sce = parseInt(sid);
            if (sce == 0) {
                await devicec.setLightTemp(settings.ip, 2700);
            } else {
                await devicec.setLightScene(settings.ip, sce);
            }
            let kelv = devices.getTemperature(settings.ip);
            let temp = ((kelv * 100) / 4500);
            this.setCapabilityValue('light_temperature', temp);
            const { r, g, b } = devices.getRGB(settings.ip);
            const { h, s, v } = ColUtill.rgb2hsv(r, g, b);
            await this.setCapabilityValue('light_hue', h / 360);
            await this.setCapabilityValue('light_saturation', v / 100);
        }
    }

    // HELPER FUNCTIONS
    /* pollDevice will update Homey if the devices has been set from another application */
    async pollDevice() {
        clearInterval(this.pollingInterval);

        this.pollingInterval = setInterval(async () => {
            const settings = this.getSettings();
            let ipAddr = settings.ip;
            let devices = new Command();
            let isState = await devices.getState(ipAddr);
            if (isState != this.getCapabilityValue('onoff')) {
                this.setCapabilityValue('onoff', isState);
            }
            let dim = await devices.getDimming(ipAddr);
            if (dim / 100 != this.getCapabilityValue('dim')) {
                this.setCapabilityValue('dim', dim / 100);
            }
            let kelvin = await devices.getTemperature(ipAddr);
            if (kelvin != this.getCapabilityValue('light_temperature')) {
                let temp = ((kelvin * 100) / 4500);
                this.setCapabilityValue('light_temperature', temp);
            }
        }, 120000);
    }

};
