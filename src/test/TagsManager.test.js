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

var TagsManager = require('../lib/TagsManager.js');
var sinon = require('sinon');
suite('', function () {
	var sut, provider, settings, data, dataParsed, ip;

	setup(function () {
		settings = {
			provider: 'HostsFile'
		};
		var Provider = require('../lib/providers/' + settings.provider + ".js");
		provider = new Provider();
		sinon.stub(provider);
		provider.update.callsArg(2);
		provider.delete.callsArg(1);
		provider.save.callsArg(1);

		ip = "192.168.1.1";
		data = 'test1=test:' + ip + ':1234';
		dataParsed = {
			'192.168.1.1':['test']
		};

		sut = new TagsManager(provider);
	});

	teardown(function () {

	});

	suite('#generate', function () {
		test('generate should pass a valid object to the provider', function (done) {
			sut.generate(data, function() {
				sinon.assert.calledWith(provider.save, dataParsed);
				done();
			});
		});
	});

	suite('#update', function () {
		test('update should pass a valid object alongside a valid identifier(for now the IP) of the one to update', function (done) {
			sut.update(data, function() {
				sinon.assert.calledWith(provider.update, ip, dataParsed);
				done();
			});
		});
	});

	suite('#delete', function () {
		test('delete should pass a valid identifier(for noe the IP)', function (done) {
			sut.delete(data, function() {
				sinon.assert.calledWith(provider.delete, ip);
				done();
			});
		});
	});
});
