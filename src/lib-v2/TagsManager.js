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

var settings = require('../settings.js'),
	Provider = require('./providers/' + settings.provider + '.js');
var TagsManager = function (provider) {
	this.provider = provider || new Provider();
};

TagsManager.prototype.generate = function (data, cb) {
	console.log('TagsManager.generate', data);
	var parsedData = this.__parseIntoArray(data);
	console.log('TagsManager.generate parsed data', parsedData);
	this.provider.save(parsedData, cb);
};

TagsManager.prototype.update = function (data, cb) {
	console.log('TagsManager.update', data);
	var parsedData = this.__parseIntoArray(data);
	var Id = this.__getIp(data);
	console.log('TagsManager.update parsedData', parsedData);
	console.log('TagsManager.update Id', Id);
	this.provider.update(Id, parsedData, cb);
};

TagsManager.prototype.delete = function (data, cb) {
	var parsedData = this.__parseIntoArray(data);
	console.log('TagsManager.delete parsedData', parsedData)
	console.log('TagsManager.delete', parsedData);
	var Id = this.__getIp(data);
	console.log('TagsManager.delete got ip', Id);
	this.provider.delete(Id, parsedData, cb);
};

TagsManager.prototype.__parseIntoArray = function (rawTags) {
	var tagsArray = rawTags.split(',');
	var ipHostPairs = {};
	tagsArray.forEach(function (tag) {
		var tagArray = tag.split('=');
		var nodeDataArray = tagArray[0].split('\t');
		var id = String(nodeDataArray[3]);
		var dataArray = String(tagArray[1]).split(':');
		if(!ipHostPairs[dataArray[1]]) {
			ipHostPairs[dataArray[1]] = [];
		};
		ipHostPairs['id'] = id;
		ipHostPairs['hostName'] = nodeDataArray[0];
		ipHostPairs[dataArray[1]].push(dataArray[0]);
	});
	return ipHostPairs;
};

TagsManager.prototype.__getIp = function (rawTags) {
	var parsedData = this.__parseIntoArray(rawTags);
	for (var key in parsedData){
		if(parsedData.hasOwnProperty(key) && key !== 'id'){
			var ip = key;
		}
	};
	return ip;
};

module.exports = TagsManager;
