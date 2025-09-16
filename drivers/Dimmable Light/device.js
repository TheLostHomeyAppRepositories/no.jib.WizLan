'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand.js');
const check = require('../../lib/checker');

var id = null;
var ipAddr = null;
var devices = null;
var isState = false;
var mydim = 50;
var kod = 0;


class DimmableDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      this.id = this.getData('id');
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      this.devices = new Command(null);
      let chk = new check();

      this.pollDevice(this.id);

      this.isState = this.devices.getState(this.ipAddr);
      if (chk.isBoolean(this.isState)) {
          if (chk.ensureBoolean(this.isState)) {
              this.setCapabilityValue('onoff', true);
          } else {
              this.setCapabilityValue('onoff', false);
          }
      } else {
          this.setCapabilityValue('onoff', false);
      }
      this.registerCapabilityListener('onoff', async (value) => {
          this.isState = value;
          const settings = this.getSettings();
          this.devices.setOnOff(settings.ip, value);
      });

      this.mydim = this.devices.getDimming(ipAddr);
      this.setCapabilityValue('dim', this.mydim);
      this.registerCapabilityListener('dim', async (value) => {
          if (value < 0) {
              value = 0;
          } else if (value > 100) {
              value = 100;
          }
          const settings = this.getSettings();
          this.devices.setBrightness(settings.ip, value);
      });
      this.pollDevice(id);
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
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   */
  async onRenamed(name) {
       this.log('WizDimmingDevice was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
       clearInterval(pfunc);
  }


  // HELPER FUNCTIONS
  async pollDevice(id) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          const sett = this.getSettings();
          let ipaddr = sett.ip;
          let dev = new Command();
          let isstate = await dev.getState(ipaddr);
          this.setCapabilityValue('onoff', isstate);
          let myDim = await dev.getDimming(ipaddr);
          this.setCapabilityValue('dim', myDim);
      }, 600000);
  }
}

module.exports = DimmableDevice;
