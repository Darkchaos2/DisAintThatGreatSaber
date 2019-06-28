const beatMapping = require('./beatMapping.json');

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

	static songConverter(song) {
		newSong = {
			"_fps": 1,
			"_notes": [
				{
					"name": "<:noteRUR:593969323803017226>",
					"_lineLayer": 0,
					"_lineIndex": 1
				},
				{
					"name": "<:noteRUL:593969323887034368>",
					"_lineLayer": 1,
					"_lineIndex": 1
				},
				{
					"name": "<:noteRU:593969323794497602>",
					"_lineLayer": 1,
					"_lineIndex": 2
				},
				{
					"name": "<:noteRR:593969323530387471>",
					"_lineLayer": 2,
					"_lineIndex": 2
				},
				{
					"name": "hi",
					"_lineLayer": 2,
					"_lineIndex": 2
				}
			]
		};



		return newSong;
	}
}

module.exports = utils;