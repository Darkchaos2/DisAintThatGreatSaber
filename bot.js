// Add bot to server, replace [botid] with the bot id. Make sure you have the correct permissions to invite a bot.
// https://discordapp.com/oauth2/authorize?client_id=[botid]&scope=bot&permissions=0
// go here: https://discordapi.com/permissions.html

// EXTERNAL DEPENDENCIES
const Discord = require('discord.js');
const http = require('https');
const fs = require('fs');
const ini = require('ini');
const AdmZip = require('adm-zip');
var download = require('download-file');
var url = require('url');
// var mixer = require('audio-mixer');

// INTERNAL
const Song = require('./Song.js');
const utils = require('./utils.js');
const Music = require('./Music.js');

// SETTINGS
const botDetails = require('./settings/botDetails.js');
const config = ini.parse(fs.readFileSync('./settings/config.ini', 'utf-8'));
const sensitiveData = ini.parse(fs.readFileSync('./settings/sensitiveData.ini', 'utf-8'));

// TEST DATA
const testSongJson = require('./maps/actual map short.json');
const testConvertedSongJson = require('./maps/testMap.json');
const testSongMeta = require('./maps/info.json');

// PROGRAM
const client = new Discord.Client();
var userMessage = null;
var botMessage = null;

client.on('ready', () => {
	// Set activity based on preferences
	ResetActivity();
	console.log("Ready");


	 
	// // Creates a new audio mixer with the specified options
	// let mixer = new AudioMixer.Mixer({
	//     channels: 2,
	//     bitDepth: 16,
	//     sampleRate: 44100,
	//     clearInterval: 250
	// });
	 
	// // Creates an input that is attached to the mixer
	// let input = mixer.input({
	//     channels: 1,
	//     volume: 75
	// });
	 
	// // Creates a standalone input
	// let standaloneInput = new AudioMixer.Input({
	//     channels: 1,
	//     bitDepth: 16,
	//     sampleRate: 48000,
	//     volume: 75
	// });
	 
	// // Adds the standalone input to the mixer
	// mixer.addInput(standaloneInput);
	 
	// // Pipes a readable stream into an input
	// fs.readFileSync('./sfx/red.mp3').pipe(input);
	// fs.readFileSync('./sfx/blue.mp3').pipe(standaloneInput);
	 
	// // Pipes the mixer output to an writable stream
	// mixer.pipe(deviceOutputStream);

	// client.channels.get("593957881938837520").join()
	// .then(vc => {
	// 	let dis = mixer.pipe(vc);



	// 	dis.on('end', () => {
	// 		console.log("dispatcher end")
	// 	});

	// 	dis.on('error', e => {
	// 	  // Catch any errors that may arise
	// 	  console.log(e);
	// 	});
	// })


	// DownloadFromSongName("demon slayer");
});


client.on('message', msg => {
	if(msg.author.bot)
		return;

	if(!msg.guild) return;

	// song.OnSwing(msg.content);

	if(msg.content.startsWith('test')) {
		let convertedSong = utils.convertSong(testSongJson, testSongMeta, 2);
		Start(convertedSong, msg.channel, msg.member);	
	}

	if(msg.content.startsWith('play ')) {
		msg.content = msg.content.slice(5);

		msg.channel.send("Searching...")
		.then(botMsg => {
			userMessage = msg;
			botMessage = botMsg;
			DownloadFromSongName(msg.content);
		})
	}

});

function Start(songJson, channel, member) {
	if(!member.voiceChannel) {
		channel.send("Beat Saber isn't the same without audio! Please join a voice channel first");
		return;
	}

	let voiceConnection = member.voiceChannel.join()
	.then(vc => {
		let music = new Music(__dirname + "\\extract\\" + songJson._eggDir, vc);

		this.song = new Song(songJson, member.id, music);
		song.Start(channel);
	})
	.catch(err => {
		console.log(err);
		channel.send("Cannot join your channel");
	})
}

function GetDomainURL(partialDir) {
	return config.BeatSaverAPI.domain + partialDir;
}

function DownloadFromSongName(songName) {
	let url = GetDomainURL(config.BeatSaverAPI.searchURL + songName);
	let json = {};

	let res = http.get(url, function(res) {
	    let jsonString = '';

	    res.on('data', function (chunk) {
	        jsonString += chunk;
	    });

	    res.on('end', function () {
	    	json = JSON.parse(jsonString);

	    	if(json.docs.length == 0) {
	    		botMessage.edit("Cannot find a song")
	    		return;
	    	}

	    	let url = GetDomainURL(json.docs[0].downloadURL);
	    	botMessage.edit(botMessage.content += `\nFound: ${json.docs[0].name}\nBlame beatsaver if you dont like the result ;)`)

			console.log(url);
			DownloadFromSongURL(url);
	    });
	})
	.on('error', function(err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});
}

function DownloadFromSongURL(url, cb) {
	botMessage.edit(botMessage.content += `\nDownloading...`)
	
	let dest = "./test.zip"

	var file = fs.createWriteStream(dest);

	file.on('finish', function() {
		file.close(OnDownloadComplete());  // close() is async, call cb after close completes.
	});

	var request = http.get(url, function(res) {

		if ( [301, 302].indexOf(res.statusCode) > -1 ) {
		    DownloadFromSongURL(GetDomainURL(res.headers.location), cb); 
		    return;
		}

		res.pipe(file);
	})
	.on('error', function(err) { // Handle errors
		console.log(err);
		fs.unlink(dest, () => console.log(err)); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});

 
	// var options = {
	//     directory: "./",
	//     filename: "test.zip"
	// }
	 
	// download(url, options, function(err){
	//     if (err) throw err
	//     console.log("meow")
	// })

}

function OnDownloadComplete() {
	botMessage.edit(botMessage.content += `\nConverting...`)
	var zip = new AdmZip("./test.zip");
	var zipEntries = zip.getEntries(); // an array of ZipEntry records

	// zipEntries.forEach(function(zipEntry) {
	//     console.log(zipEntry.toString()); // outputs zip entries information
	// });

	zip.extractAllTo(__dirname + '/extract', true);

	let songMeta = fs.readFileSync('./extract/info.dat', 'utf8');
	songMeta = JSON.parse(songMeta);

	let songJson = fs.readFileSync('./extract/' + songMeta._difficultyBeatmapSets[0]._difficultyBeatmaps[0]._beatmapFilename, 'utf8');
	songJson = JSON.parse(songJson);

	let convertedSong = utils.convertSong(songJson, songMeta, 2);
	Start(convertedSong, botMessage.channel, userMessage.member);

}

function ResetActivity() {
	client.user.setActivity(config.Preferences.activity, { type: config.Preferences.activityType });
}

// login bot
client.login(botDetails.botToken)
.catch(() => {
	console.log("Could not connect");
});
