/*jslint node: true */
"use strict";
var headlessWallet = require('../start.js');
var eventBus = require('trustnote-common/event_bus.js');

var fs = require('fs');
var desktopApp = require('trustnote-common/desktop_app.js');
var appDataDir = desktopApp.getAppDataDir();

var SIGNEDUNITS_FILENAME = appDataDir + '/UnitSigned.json';

function onError(err){
	throw Error(err);
}

function ReadSignedUnitAndChain(){
	var composerExchange = require('trustnote-common/composerExchange.js');
	var network = require('trustnote-common/network.js');

	var callbacks = composerExchange.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function (objJoint) {
			network.broadcastJoint(objJoint);
		}
	});

	console.log('-----------------------');
	console.log("Begin Chain ...");
	console.log('-----------------------');
	fs.readFile(SIGNEDUNITS_FILENAME, 'utf8', function(err, data){
		if (err){
			console.log('failed to read signed units, will exit');
			process.exit(0);
		}
		else{
			var objSignedUnit = JSON.parse(data);
			composerExchange.composeJointExchangeToChain(objSignedUnit, callbacks);
		}
	});
}

eventBus.on('headless_wallet_ready', ReadSignedUnitAndChain);
