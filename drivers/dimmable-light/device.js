'use strict';

const Homey = require('homey');
const Command = require('../../lib/WizCommand.js');

module.exports = class NewDimmableDevice extends Homey.Device {

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

        let mydim = await devices.getDimming(ipAddr);
        this.setCapabilityValue('dim', mydim / 100);
        this.registerCapabilityListener('dim', async (value) => {
            let sdim = value * 100;
            if (sdim < 0) {
                sdim = 1;
            } else if (sdim > 100) {
                sdim = 100;
            }
            let devicec = new Command();
            const settings = this.getSettings();
            await devicec.setBrightness(settings.ip, sdim);
        });

        this.pollDevice();
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('WizDimming has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        this.log('WizDimming device settings changed (IP) ' + ipAddr);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     */
    async onRenamed(name) {
        this.log('WizDimming device was renamed to ' + name);
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        clearInterval(pfunc);
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
        }, 120000);
    }
};
