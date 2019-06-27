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
}

module.exports = utils;