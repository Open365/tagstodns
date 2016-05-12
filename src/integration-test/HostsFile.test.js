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

var HostsFile = require('../lib/providers/HostsFile.js');
var sinon = require('sinon');
var fs = require('fs');
var assert = require('chai').assert;

suite('', function () {
	var sut, settings, data;

	setup(function () {
		settings = {
			hostsFile: {
				tempPath: '/tmp/tags-to-dns-hosts-test-file'
			},
			dnsDomain: ".test"
		};

		data = "127.0.0.1\tfire.web\n205.22.22.22\twater.web\n";

		sut = new HostsFile(settings);
	});

	teardown(function (done) {
		fs.unlink(settings.hostsFile.tempPath, function() {
			done();
		});
	});

	suite('#delete', function () {
		teardown(function (done) {
			fs.unlink(settings.hostsFile.tempPath, function() {
				done();
			});
		});

		test('should remove fire.web', function (done) {
			fs.appendFileSync(settings.hostsFile.tempPath, data);
			sut.delete('127.0.0.1', function() {
				var newData = fs.readFileSync(settings.hostsFile.tempPath).toString('utf8');
				assert.deepEqual(newData, '205.22.22.22\twater.web\n');
				done();
			});
		});

		test('should call callback when no file exists', function(done) {
			sut.delete('127.0.0.1', done);
		});
	});

	suite('#update', function () {
		test('should update the value', function(done) {
			fs.appendFileSync(settings.hostsFile.tempPath, data);
			sut.update('127.0.0.1', {'127.0.0.1': ['earth.web']}, function() {
				var newData = fs.readFileSync(settings.hostsFile.tempPath).toString('utf8');
				assert.deepEqual(newData, '205.22.22.22\twater.web\n127.0.0.1\tearth.web.test \n');
				done();
			});
		});
		test('should call callback when no file exists', function(done) {
			sut.update('127.0.0.1', {'127.0.0.1': ['earth.web']}, done);
		});
	});
});
