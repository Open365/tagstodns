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

var sinon = require('sinon');
var assert = require('chai').assert;
var fs = require('fs');
var tmp = require('tmp');
var child_process = require('child_process');

function callTagsToDns(event, stdin, file) {
	process.env.SERF_EVENT = event
	process.env.DISCOVERY_HOSTS_FILE_PATH = file;
	var tagsToDnsPath = fs.realpathSync(__dirname + '/../src/tagsToDns.js');
	var tagsToDns = child_process.spawn(tagsToDnsPath);
	tagsToDns.stdout.on('data', function(data) {
		console.log(data.toString());
	});
	tagsToDns.stdin.write(stdin);

	return tagsToDns;
}
suite('tagsToDns', function(){
	suite('#method', function(){
		test('description', function(done){
			this.timeout(2222222);
			var tagsToDns = callTagsToDns('member-update', fs.readFileSync(__dirname + '/stdin.txt'), '/tmp/tests.host');
			tagsToDns.stdin.end();
			tagsToDns.on('exit', function() {
				done();
			});
		});
		test('description', function(done){
			this.timeout(2222222);
			var tagsToDns = callTagsToDns('member-update', fs.readFileSync(__dirname + '/stdin2.txt'), '/tmp/tests.host');
			tagsToDns.stdin.end();
			tagsToDns.on('exit', function() {
				done();
			});
		});
	});
});