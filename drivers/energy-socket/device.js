'use strict';

const Homey = require('homey');
const Command = require('../../lib/WizCommand');

module.exports = class NewEnergySocketDevice extends Homey.Device {

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
            let devicec = new Command();
            const settings = this.getSettings();
            await devicec.setOnOff(settings.ip, value);
        });

        let power = await devices.getPower(ipAddr);
        let tempn = Number(power);
        let npower = Math.abs(tempn / 1000);
        this.setCapabilityValue('measure_power', npower);

        this.pollDevice();
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('WizPowerPlug has been added');
    }

    /**
     * onSettings is called when the user updates the device's settings.
     */
    async onSettings({ oldSettings, newSettings, changedKeys }) {
        const settings = this.getSettings();
        let ipAddr = settings.ip;
        this.log('WizPowerPlug device settings changed (IP) ' + ipAddr);
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     */
    async onRenamed(name) {
        this.log('WizPowerPlug device was renamed to ' + name);
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        clearInterval(this.pollingInterval);
    }

    // FLOW functions
    async flowPower(message) {
        if (args.hasOwnProperty('nwatt')) {
            const settings = this.getSettings();
            let ipAddr = settings.ip;
            let devices = new Command();
            let power = await devices.getPower(ipAddr);
            if (power <= velk) {
                return true;
            }
            return false;
        }
        return false;
    }

    // HELPER FUNCTIONS
    async pollDevice() {
        clearInterval(this.pollingInterval);

        this.pollingInterval = setInterval(async () => {
            const settings = this.getSettings();
            let ipAddr = settings.ip;
            let devices = new Command();
            let sstat = await devices.getState(ipAddr);
            this.setCapabilityValue('onoff', sstat);
            let xpower = await devices.getPower(ipAddr);
            let tpower = Number(xpower);
            let npower = Math.abs(tpower / 1000)
            this.setCapabilityValue('measure_power', npower);
        }, 120000);
    }
};
