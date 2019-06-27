class MessageConverter {
	constructor(json) {
		this.json = json;

		this.beatMap = {
			// red
			0: {
				0: ':noteBD:',
				1: ':noteBDL:',
				2: ':noteBL:',
				3: ':noteBUL:',
				4: ':noteBU:',
				5: ':noteBUR:',
				6: ':noteBR:',
				7: ':noteBDR:',
			},
			// blue
			1: {
				0: ':noteRD:',
				1: ':noteRDL:',
				2: ':noteRL:',
				3: ':noteRUL:',
				4: ':noteRU:',
				5: ':noteRUR:',
				6: ':noteRR:',
				7: ':noteRDR:',
			}
		};
	}

	parse(time) {
		let template = [
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:'],
			[':blank:', ':blank:', ':blank:', ':blank:']
		];

		let beats = this.json._notes.filter(note => note._time == time);

		for(let beatIdx in beats) {
			let beat = beats[beatIdx];

			template[beat._lineLayer][beat._lineIndex] = this.beatToText(beat);
		}

		let output = '';
		for(let i = template.length - 1; i > -1; i--) {
			output += template[i].join('') + '\n';
		}

		return output;
	}

	beatToText(beat) {
		let colour = this.beatMap[beat._type];
		if(!colour)
			return ':blank:';

		let cut = colour[beat._cutDirection]
		if(!cut)
			return ':blank:';

		return cut;
	}
}

module.exports = MessageConverter;