const utils = require('./utils.js');
const Discord = require('discord.js');

class Music {
	constructor(songFile, voiceConnection) {
		this.songFile = songFile;
		this.vc = voiceConnection;

		this.time = 0;
		this.dispatcher = null;
	}

	Play() {
		if(this.dispatcher) {
			this.dispatcher.resume(); // Carry on playing
			return;
		}
		console.log(this.songFile)

		this.dispatcher = this.vc.playFile(this.songFile);
		console.log(this.dispatcher)

		this.dispatcher.on('end', () => {
			console.log("dispatcher end")
		});

		this.dispatcher.on('error', e => {
		  // Catch any errors that may arise
		  console.log(e);
		});

		this.dispatcher.setVolume(0.5); // Set the volume to 50%

		// console.log(this.dispatcher.time); // The time in milliseconds that the stream this.dispatcher has been playing for
	}

	Pause() {
		this.dispatcher.pause(); // Pause the stream
	}

	Stop() {
		this.dispatcher.end(); // End the dispatcher, emits 'end' event
	}

	OnSlash() {

	}

	OnMiss() {

	}

	OnRedLaser() {

	}

	OnBlueLaser() {

	}
}

module.exports = Music;