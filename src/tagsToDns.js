#!/usr/bin/env node
/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var settings = require('./settings.js');
if (settings.version <= 1) {
	var TagsManager = require('./lib/TagsManager.js');
} else {
	var TagsManager = require('./lib-v' + settings.version + '/TagsManager.js');
}
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});
var tagsManager = new TagsManager();
var q = require('queue')();
q.concurrency = 1;

var fs = require('fs');

fs.writeFileSync(settings.hostsFile.tempPath, fs.readFileSync(settings.hostsFile.path));

rl.on('line', function(line){
	var action = process.env.SERF_EVENT;
	console.log('tagsToDns got event:', action, line);
	if(line.indexOf("=") > -1) {
		switch(action) {
			case "member-join":
				q.push(function(cb) { tagsManager.generate(line, cb); });
				break;
			case "member-update":
				q.push(function(cb) { tagsManager.update(line, cb); });
				break;
			case "member-failed":
				q.push(function(cb) { tagsManager.delete(line, cb); });
				break;
			case "member-leave":
				q.push(function(cb) { tagsManager.delete(line, cb); });
				break;
			case "member-reap":
				q.push(function(cb) { tagsManager.delete(line, cb); });
				break;
		}
	}
});

rl.on('close', function() {
	q.start();
});

q.on('end', function() {
	fs.renameSync(settings.hostsFile.tempPath, settings.hostsFile.path);
});
