const beatMapping = require('./data/beatMapping.json');

class utils {
	static emoteToBeat(name) {
		let colour;
		let cutDir;

		if(emote.name.match(/noteR/g)) {
			colour = 1;
		}
		else if(emote.name.match(/noteB/g)) {
			colour = 0;
		}
		else {
			return null;
		}

		switch(emote.name.substring(5)) {
			case(ND):
				cutDir = 8;
				break;
			case(DR):
				cutDir = 7;
				break;
			case(R):
				cutDir = 6
				break;
			case(UR):
				cutDir = 5;
				break;
			case(U):
				cutDir = 4;
				break;
			case(UL):
				cutDir = 3;
				break;
			case(L):
				cutDir = 2;
				break;
			case(DL):
				cutDir = 1;
				break;
			case(D):
				cutDir = 0;
				break;
			default:
				return null;
		}

		return [colour, cutDir];
	}

	static beatToText(beat) {
		let colour = beatMapping[beat._type];
		if(!colour)
			return ':blank:';

		let cut = colour[beat._cutDirection]
		if(!cut)
			return ':blank:';

		return cut;
	}

	static convertSong(song, meta, fps = 2) {
		let newSong = {
			_name: meta.songName,
			_oggDir: meta._songFilename,
			_fps: fps,
			_notes: [
			]
		};

		let longestTime = this.roundToNearest(song._notes[song._notes.length - 1]._time, fps);
		console.log(longestTime)

		for(let beat of song._notes.values()) {
			let currentTime = this.roundToNearest(beat._time, fps);

			if(song._notes.some(futurebeat => futurebeat._time == currentTime))
				continue;

			beat._time = currentTime;
		}

		// song._notes.foreach(note => {
		// 	note._time = this.roundToNearest(note._time, fps);
		// });

		for(let i = 0; i <= longestTime; i += fps) {
			let tempBeat = song._notes.find(beat => beat._time == i);

			if(!tempBeat)
				continue;

			console.log("adding " + i)
			newSong._notes.push(this.beatToNewFormat(tempBeat));
		}

		return newSong;
	}

	static roundToNearest(numer, nearest) {
		return Math.round(numer / nearest) * nearest;
	}

	static beatToNewFormat(beat) {
		let newBeat = {
			name: null,
			_lineLayer: null,
			_lineIndex: null
		}

		newBeat.name = beatMapping[beat._type][beat._cutDirection];
		newBeat._lineLayer = beat._lineLayer;
		newBeat._lineIndex = beat._lineIndex;

		return newBeat;
	}
}

module.exports = utils;