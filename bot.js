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

// INTERNAL
const Song = require('./Song.js');

// SETTINGS
const botDetails = require('./settings/botDetails.js');
let config;
let sensitiveData;

// DATA
// Activity types: PLAYING, STREAMING, LISTENING, WATCHING
const activityType = ['playing', 'streaming', 'listening', 'watching'];

// FUNCTIONS
function LoadConfig() {
	config = ini.parse(fs.readFileSync('./settings/config.ini', 'utf-8'));
	sensitiveData = ini.parse(fs.readFileSync('./settings/sensitiveData.ini', 'utf-8'));
}

function GetConfig() {
	return config;
}

function SaveConfig() {
	fs.writeFileSync('./settings/config.ini', ini.stringify(config));
}

function download(url, dest, cb) {
};

// PROGRAM
LoadConfig();
const songJson = require(sensitiveData.aSongDir);

const client = new Discord.Client();
let song = new Song(songJson, 2);

client.on('ready', () => {
	// Set activity based on preferences
	client.user.setActivity(config.Preferences.activity, { type: activityType[config.Preferences.activityType] });
	console.log("Ready");

	song.Start(client.channels.get("576032970524065841"));

	// GetSongDownloadURL("hello");
});


client.on('message', msg => {
	if(msg.author.bot)
		return;

	song.OnSwing(msg.content);











	if(msg.content.startsWith('play')) {
		msg.content = msg.content.slice(5);






		// let url = config.BeatSaverAPI.searchURL + msg.content;
		// console.log(url);

		// download(url, './', console.log('download'))
	}

});

function GetSongDownloadURL(songName) {
	let url = config.BeatSaverAPI.domain + config.BeatSaverAPI.searchURL + songName;
	let json = {};

	let request = http.get(url, function(res) {
	    let jsonString = '';

	    res.on('data', function (chunk) {
	        jsonString += chunk;
	    });

	    res.on('end', function () {
	    	json = JSON.parse(jsonString);

	    	console.log(json.docs[0]);
	    	let url = config.BeatSaverAPI.domain + json.docs[0].downloadURL

			console.log(url);
			DownloadSong(url);
	    });
	})
	.on('error', function(err) { // Handle errors
		fs.unlink(dest); // Delete the file async. (But we don't check the result)
		if (cb) cb(err.message);
	});
}

function DownloadSong(uri, cb) {
	let dest = "./test.zip"

	var file = fs.createWriteStream(dest);

	var request = http.get(url, function(res) {

		if ( [301, 302].indexOf(res.statusCode) > -1 ) {
			console.log(res.headers);
			console.log(res.headers.location);
		     DownloadSong(res.headers.location, cb); 
		     return;
		}

		res.pipe(file);

		file.on('finish', function() {
			file.close(OnDownloadComplete());  // close() is async, call cb after close completes.
		});
	})
	.on('error', function(err) { // Handle errors
		fs.unlink(dest, console.log(err)); // Delete the file async. (But we don't check the result)
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
	var zip = new AdmZip("./test.zip");
	var zipEntries = zip.getEntries(); // an array of ZipEntry records

	zipEntries.forEach(function(zipEntry) {
	    console.log(zipEntry.toString()); // outputs zip entries information
	});

	// extracts everything
	zip.extractAllTo('./extract', true);

}

// login bot
client.login(botDetails.botToken)
.catch(() => {
	console.log("Could not connect");
});
