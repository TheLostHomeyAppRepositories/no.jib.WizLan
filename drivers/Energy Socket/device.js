'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand');
const check = require('../../lib/checker');

var id = null;
var ipAddr = null;
var macAddr = null;
var devices = null;
var isState = false;
var stat = false;
var power = 0;
var limit = 0;

var kod = 0;

class EnergySocketDevice extends Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
      this.id = this.getData('id');
      const settings = this.getSettings();
      this.ipAddr = settings.ip;
      this.macAddr = settings.mac;
      this.devices = new Command(null);
      let chk = new check();

      this.pollDevice(this.id, this.devices);

      this.isState = this.devices.getState(this.ipAddr);
      this.stat = this.isState;
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
          this.stat = value;
          const settings = this.getSettings();
          return await this.devices.setOnOff(settings.ip, value);
      });

      this.power = this.devices.getPower(ipAddr);
      var tempn = Number(this.power);
      var npower = Math.abs(tempn / 1000);
      this.setCapabilityValue('measure_power', npower);
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizPowerSocket has been added');
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
      this.log('WizPowerPlugDevice was renamed to ' + name);
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
          return this.getPower(args.nwatt);
      }
      return false;
  }

  // HELPER FUNCTIONS
  async pollDevice(id) {
      clearInterval(this.pollingInterval);

      this.pollingInterval = setInterval(async () => {
          const sett = this.getSettings();
          let ipaddr = sett.ip;
          let dev = new Command();
          let sstat = await dev.getState(ipaddr);
          this.setCapabilityValue('onoff', sstat);
          let xpower = await dev.getPower(ipaddr);
          let tpower = Number(xpower);
          let npower = Math.abs(tpower / 1000)
          this.setCapabilityValue('measure_power', npower);
      }, 60000);
  }

  getPower(velk) {
      const sett = this.getSettings();
      let ipaddr = sett.ip;
      let dev = new Command();
      let power = dev.getPower(ipAddr);
      if (this.power <= velk) {
          return true;
      }
      return false;
  }
}

module.exports = EnergySocketDevice;
