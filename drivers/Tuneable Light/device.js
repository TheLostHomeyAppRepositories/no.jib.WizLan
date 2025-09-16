'use strict';

const { Device } = require('homey');
const Command = require('../../lib/WizCommand');
const check = require('../../lib/checker');

var id = null;
var ipAddr = null;
var macAddr = null;
var devices = null;
var isState = false;

var mydim = 50;
var scene = 0;
var temp = 0;

class TuneableDevice extends Device {

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

      let dim = this.devices.getDimming(this.ipAddr);
      this.mydim = dim;
      this.setCapabilityValue('dim', dim);
      this.registerCapabilityListener('dim', async (value) => {
          if (value < 0) {
              value = 0;
          } else if (value > 100) {
              value = 100;
          }
          const settings = this.getSettings();
          this.devices.setBrightness(settings.ip, value);
      });

      let tmp = this.devices.getTemperature(this.ipAddr);
      this.temp = tmp;
      this.setCapabilityValue('kelvin', tmp);
      this.registerCapabilityListener('kelvin', async (value) => {
          if (value < 2100) {
              value = 2100;
          } else if (value > 6000) {
              value = 6000;
          }
          const settings = this.getSettings();
          this.devices.setLightTemp(settings.ip, value);
      });

      var nums = this.devices.getScene(this.ipAddr);
      this.scene = this.checkScene(nums);
      this.setCapabilityValue('scene', this.scene.toString());
      this.registerCapabilityListener('scene', async (value) => {
          this.scene = value;
          const settings = this.getSettings();
          if (this.scene == 0) {
              this.scene = 0;
              this.devices.setLightTemp(settings.ip, 2700);
          } else {
              this.devices.setLightScene(settings.ip, this.scene);
          }
      });
}

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
      this.log('WizTuneable has been added');
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
      this.log('WizTuneable was renamed to ' + name);
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
      clearInterval(this.pollingInterval);
  }

  // FLOW functions

  async createKelvin(args, state) {
      if (args.hasOwnProperty('ktemp')) {
          this.callLightTemp(args.ktemp);
      }
  }

  async createWhiteC(args, state) {
      if (args.hasOwnProperty('scene')) {
          this.callSetScene(args.scene);
      }
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
          let wtemp = await dev.getTemperature(ipaddr);
          this.setCapabilityValue('kelvin', wtemp);
          let nums = await dev.getScene(ipaddr);
          let wscene = this.checkScene(nums);
          this.setCapabilityValue('scene', wscene.toString());
     }, 600000);
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

  callLightTemp(ktm) {
      const sett = this.getSettings();
      let ipaddr = sett.ip;
      let dev = new Command();
      dev.setLightTemp(ipAddr, ktm);
  }

  callSetScene(sce) {
      const sett = this.getSettings();
      let ipaddr = sett.ip;
      let dev = new Command();
      dev.setLightScene(ipAddr, sce);
  }
}

module.exports = TuneableDevice;
