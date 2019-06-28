const utils = require('./utils.js');

class Song {
	constructor(json, fps) {
		this.json = json;
		this.fps = fps;

		this.health = 0.5;
		this.acceptableInputs = [];
		this.time = -1;
		this.hasSwung = true;
	}

	toDiscordMessage(time) {
		let template = [
			['<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>'],
			['<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>'],
			['<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>', '<:blank:593968418043068417>']
		];


		template[this.json._notes[time]._lineLayer][this.json._notes[time]._lineIndex] = `${this.json._notes[time].name}`;

		let output = `Energy: ${parseInt(this.health * 100)}%`;
		for(let i = template.length - 1; i > -1; i--) {
			output += '\n' + template[i].join('');
		}

		return output;
	}

	OnSwing(swung) {
		this.hasSwung = true;

		if(swung == this.json._notes[this.time].name) {
			console.log("success");
			this.health += 0.01;
		}
		else {
			console.log("fail");
			this.health -= 0.15;
		}
		console.log(this.health);
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
			this.health -= 0.1;

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