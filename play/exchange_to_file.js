/*jslint node: true */
"use strict";
var headlessWallet = require('../start.js');
var eventBus = require('trustnote-common/event_bus.js');

var fs = require('fs');
var desktopApp = require('trustnote-common/desktop_app.js');
var appDataDir = desktopApp.getAppDataDir();

var UNITS_FILENAME = appDataDir + '/' + 'UnitUnsign.json';

function onError(err){
	throw Error(err);
}

function createPayment(){
	var composerExchange = require('trustnote-common/composerExchange.js');

	var callbacks = {
			ifNotEnoughFunds: onError,
			ifError: onError,
			ifOk: function(objJoint){
				writeUnits(objJoint);
			}
		};

	var from_address = "UTBHP3FL5FRHZR3JMK2ZVQXETBPQTHJA";
	var payee_address = "WXFM3HXOUCLEKNORSTHIK36LP3WUNSTL";
	var arrOutputs = [
		{address: from_address, amount: 0},      // the change
		{address: payee_address, amount: 1000}  // the receiver
	];
	composerExchange.composePaymentJointExchange([from_address], arrOutputs, headlessWallet.signer, callbacks);
}

function writeUnits(objUnit){

	fs.writeFile(UNITS_FILENAME, JSON.stringify(objUnit, null, '\t'), 'utf8', function(err){
		if (err)
			throw Error("failed to write units file");
	});
}

eventBus.on('headless_wallet_ready', createPayment);
