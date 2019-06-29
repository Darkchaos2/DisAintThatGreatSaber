const utils = require('./utils.js');
const Discord = require('discord.js');
const Music = require('./Music.js');

class Song {
	constructor(json, playerID, music) {
		this.json = json;
		this.playerID = playerID;
		this.music = music;

		this.health = 0.5;
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

	Start(channel) {
		console.log(this.json._name)
		channel.guild.me.client.user.setActivity(this.json._name, { type: 'PLAYING' });

		this.music.Play();
	
		channel.send("Setting up...")
		.then(msg => {
			this.msg = msg;
			let promises = this.InitReactions(msg);

			const filter = (reaction, user) => {
				// return user.id == msg.author.id;
				return user.id == this.playerID;
			}

			this.collector = msg.createReactionCollector(filter);
			this.collector.on('collect', (reaction, reactionCollector) => {
				console.log(reaction.emoji.toString());
				this.OnSwing(reaction.emoji.toString());
				reaction.remove(msg.guild.members.get(this.playerID));
			})
			this.collector.on('end', collected => {
				console.log("emoji collector ended");
			})

			Promise.all(promises)
			.then(() => {
				this.interval = setInterval(() => this.nextFrame(msg, this.interval), this.json._fps * 1000);
			})

		})
	}

	InitReactions(msg) {
		let promises = [];

		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969324033835038"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323794628630"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969324125978632"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323869995039"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323882840074"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323492769803"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323840634901"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323760943116"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323895291916"))

		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323564072961"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323807342592"))
		// promises[promises.length] = msg.react(msg.author.client.emojis.get("445580723240435714"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323887034368"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323794497602"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323803017226"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323794759700"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323765137419"))
		promises[promises.length] = msg.react(msg.author.client.emojis.get("593969323798822935"))

		return promises;
	}

	nextFrame(msg, interval) {
		console.log("Drwawing next frame");
		this.time++;

		// If there are no more notes, stop
		if(this.time > this.json._notes.length - 1) {
			this.Stop()
			return;
		}

		// If user did not swing before the last frame ended, reduce health
		if(!this.hasSwung) {
			this.health -= 0.1;

		}
		
		if(this.health <= 0) {
			this.Stop("You Died!")
			return;
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

	Stop(customMesage = "Finished!") {
		this.collector.stop();
		this.msg.guild.me.client.user.setActivity("Finished", { type: "PLAYING" });
		clearInterval(this.interval);

		this.music.Stop();

		this.msg.edit(customMesage);
	}

	OnFinish() {
	}

	OnSwing(swung) {
		if(this.time < 0)
			return;

		if(this.hasSwung)
			return;

		if(swung == this.json._notes[this.time].name) {
			console.log("success");
			this.health += 0.01;
		}
		else {
			console.log("fail");
			this.health -= 0.15;
		}

		this.hasSwung = true;
		console.log(this.health);
	}
}

module.exports = Song;