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

suite('', function () {
	var sut, settings, fs, data, ip;

	setup(function () {
		settings = {
			hostsFile: {
				tempPath: '/tmp/t'
			},
			dnsDomain: ".test"
		};

		fs = {
			readFile: sinon.stub(),
			writeFile: sinon.stub(),
			appendFile: sinon.stub()
		};

		data = "127.0.0.1\tfire.web\n205.22.22.22\twater.web";
		fs.readFile.callsArgWith(1, null, data);
		fs.writeFile.callsArg(2);
		fs.appendFile.callsArg(2);

		ip = "127.0.0.1";
		sut = new HostsFile(settings, fs);
	});

	teardown(function () {

	});

	suite('#delete', function () {
		test('should read the hosts file', function (done) {
			sut.delete(ip, function() {
				sinon.assert.calledWith(fs.readFile, settings.hostsFile.tempPath);
				done();
			});
		});
		test('should write the hosts file', function (done) {
			sut.delete(ip, function() {
				sinon.assert.calledWith(fs.writeFile, settings.hostsFile.tempPath);
				done();
			});
		});
		test('should remove the ip from the hosts file', function (done) {
			sut.delete(ip, function() {
				sinon.assert.calledWith(fs.writeFile, settings.hostsFile.tempPath, "205.22.22.22\twater.web");
				done();
			});
		});
	});

	suite('#update', function () {
		test('should read the hosts file', function (done) {
			sut.update(ip, null, function() {
				sinon.assert.calledWith(fs.readFile, settings.hostsFile.tempPath);
				done();
			});
		});
		test('should call fs.appendFile', function (done) {
			sut.update(ip, {"127.0.0.1": ["fireNation"]}, function() {
				sinon.assert.calledWith(fs.appendFile, settings.hostsFile.tempPath, "127.0.0.1\tfireNation.test \n");
				done();
			});
		});
		test('should call fs.appendFile passing space separated domains', function (done) {
			sut.update(ip, {"127.0.0.1": ["fireNation", "waterNation"]}, function() {
				sinon.assert.calledWith(fs.appendFile, settings.hostsFile.tempPath, "127.0.0.1\tfireNation.test waterNation.test \n");
				done();
			});
		});
	});
});
