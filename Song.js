const utils = require('./utils.js');

class Song {
	constructor(json, fps) {
		this.health = 0.8;
		this.acceptableInputs = [];
		this.time = 0;

		this.json = json;
		this.fps = fps;
	}

	toDiscordMessage(time) {
		let template = [
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:']
		];


		template[this.json._notes[time]._lineLayer][this.json._notes[time]._lineIndex] = this.json._notes[time].text;

		let output = '';
		for(let i = template.length - 1; i > -1; i--) {
			output += template[i].join('') + '\n';
		}

		return output;
	}

	OnSwing(emote) {
		beatSwung = utils.emoteToBeat(emote.name);


	}

	Start(channel) {
		var bigThis = this;

		channel.send("temp")
		.then(msg => {
			var interval = setInterval(() => {
				if(bigThis.time > bigThis.json._notes.length - 1) {
					clearInterval(interval);
					msg.edit("Finished!");
					return;
				}

				console.log(bigThis.time);
				console.log(bigThis.toDiscordMessage(bigThis.time));
				msg.edit(bigThis.toDiscordMessage(bigThis.time))
				.then(msg => {

				});
				bigThis.time++;

			}, this.fps * 1000);
		})
	}

	Play() {
	}

	Stop() {

	}
}

module.exports = Song;