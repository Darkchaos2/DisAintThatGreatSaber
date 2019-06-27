const utils = require('./utils.js');

class Song {
	constructor(json, fps) {
		this.json = json;
		this.fps = fps;

		this.health = 50;
		this.acceptableInputs = [];
		this.time = -1;
		this.hasSwung = true;
	}

	toDiscordMessage(time) {
		let template = [
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:']
		];


		template[this.json._notes[time]._lineLayer][this.json._notes[time]._lineIndex] = `:${this.json._notes[time].name}:`;

		let output = `Energy: ${parseInt(this.health)}%`;
		for(let i = template.length - 1; i > -1; i--) {
			output += '\n' + template[i].join('');
		}

		return output;
	}

	OnSwing(swung) {
		this.hasSwung = true;
		console.log(swung);
		console.log(this.json._notes[this.time].name);

		if(swung == this.json._notes[this.time].name) {
			console.log("success");
			this.health += 1;
		}
		else {
			console.log(`before ${this.health}`);
			console.log("fail");
			this.health -= 15;
			console.log(`after ${this.health}`);
		}
	}

	Start(channel) {
		channel.send("Setting up...")
		.then(msg => {
			var interval = setInterval(() => this.nextFrame(msg, interval), this.fps * 1000);
		})
	}

	nextFrame(msg, interval) {
		console.log("Drwawing next frame");
		this.time++;

		// If there are no more notes, stop
		if(this.time > this.json._notes.length - 1) {
			clearInterval(interval);
			msg.edit("Finished!");
			return;
		}

		// If user did not swing before the last frame ended, reduce health
		if(!this.hasSwung) {
			this.health -= 10;

			if(this.health <= 0) {
				clearInterval(interval);
				msg.edit("You died!");
				return;
			}
		}

		// Log to console
		console.log(this.time);
		console.log(this.toDiscordMessage(this.time));


		// Reset swung bool for next frame
		this.hasSwung = false;

		// Edit message to next frames
		msg.edit(this.toDiscordMessage(this.time))
		.then(msg => {
		});

	}

	Play() {
	}

	Stop() {

	}
}

module.exports = Song;