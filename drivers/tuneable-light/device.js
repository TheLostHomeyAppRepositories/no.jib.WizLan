'use strict';

const Homey = require('homey');
const Command = require('../../lib/WizCommand');

module.exports = class NewTuneableDevice extends Homey.Device {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        const id = this.getData('id');
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        let macAddr = settings.mac;
        let devices = new Command();

        let isState = await devices.getState(ipAddr);

        this.setCapabilityValue('onoff', isState);
        this.registerCapabilityListener('onoff', async (value) => {
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setOnOff(settings.ip, value);
        });

        let mydim = await devices.getDimming(ipAddr);
        this.setCapabilityValue('dim', mydim / 100);
        this.registerCapabilityListener('dim', async (value) => {
            let sdim = value * 100;
            if (sdim < 0) {
                sdim = 0;
            } else if (sdim > 100) {
                sdim = 100;
            }
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setBrightness(settings.ip, sdim);
        });

        let temp = await devices.getTemperature(ipAddr);
        this.setCapabilityValue('kelvin', temp);
        this.registerCapabilityListener('kelvin', async (value) => {
            if (value < 2000) {
                value = 2000;
            } else if (value > 6500) {
                value = 6500;
            }
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setLightTemp(settings.ip, value);
        });

        let nums = await devices.getScene(ipAddr);
        let scene = this.checkScene(nums);
        this.setCapabilityValue('scene', scene.toString());
        this.registerCapabilityListener('scene', async (value) => {
            let sce = parseInt(value);
            let devices = new Command();
            const settings = this.getSettings();
            if (sce == 0) {
               sce = 0;
               await devices.setLightTemp(settings.ip, 2700);
            } else {
                await devices.setLightScene(settings.ip, sce);
            }
        });

        this.pollDevice();
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('WizTuneable device has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        this.log('WizTuneable device settings changed (IP) ' + ipAddr);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     */
    async onRenamed(name) {
        this.log('WizTuneable device was renamed to ' + name);
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

    async createKelvin(args, state) {
        if (args.hasOwnProperty('ktemp')) {
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setLightTemp(settings.ip, args.ktemp);
        }
    }

    async createWhiteC(args, state) {
        if (args.hasOwnProperty('scene')) {
            let devices = new Command();
            const settings = this.getSettings();
            await devices.setLightScene(settings.ip, sce);
        }
    }

    // HELPER FUNCTIONS
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
            if (kelvin != this.getCapabilityValue('kelvin')) {
                this.setCapabilityValue('kelvin', kelvin);
            }
        }, 120000);
    } 

    checkScene(val) {
        if (val == 6) {
            return 6;
        }
        if (val == 11) {
            return 11;
        }
        if (val == 12) {
            return 12;
        }
        if (val == 13) {
            return 13;
        }
        if (val == 14) {
            return 14;
        }
        if (val == 15) {
            return 15;
        }
        if (val == 16) {
            return 16;
        }
        if (val == 18) {
            return 18;
        }
        if (val == 30) {
            return 30;
        }
        return 0;
    }
};
