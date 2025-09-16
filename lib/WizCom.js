"use strict";

const Dgram = require('dgram');
const konst = require('./constants');

class WizCom {

	async getDevMessage(ipAdr, cmnd) {
		return new Promise(function (resolve, reject) {
			const client = Dgram.createSocket('udp4');

			const toid = setTimeout(() => {
				clearTimeout(toid);
				client.close();
				resolve(null);
			}, 5000);

			process.on('unhandledRejection', error => {
				clearTimeout(toid);
			});

			client.on('message', function (msg, info) {
				clearTimeout(toid);
				client.close();

				let str = msg.toString('utf8');

				resolve(str);
			});

			client.send(cmnd, 0, cmnd.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
				if (err) {
					clearTimeout(toid);
					console.log(err);
					resolve(null);
				}
			});
		});
	}

	async sendMessage(message, ipAdr) {
		return new Promise(function (resolve, reject) {
			const client = Dgram.createSocket('udp4');

			const frid = setTimeout(() => {
				clearTimeout(frid);
				client.close();
				console.log("Client timed out!");
				resolve(false);
			}, 5000);

			process.on('unhandledRejection', error => {
				clearTimeout(frid);
				console.log(error.getMessage);
				resolve(false);
			});

			client.on('message', function (msg, info) {
				clearTimeout(frid);
				client.close();
				const str = JSON.stringify(msg);
				const cod = str.replace(/[^\x00-\x7F]/g, "");
				let JSonObj = JSON.parse(cod.toString('utf8'));
				if (JSonObj.hasOwnProperty('success')) {
					let wsuccess = JSonObj.result.success;
					resolve(wsuccess);
				}
				resolve(true);
			});

			client.send(message, 0, message.length, konst.LIGHT_UDP_CONTROL_PORT, ipAdr, function (err, bytes) {
				if (err) {
					clearTimeout(frid);
					client.close();
					console.log(err);
					resolve(false);
				}
			});
		});
	}
}
module.exports = WizCom;