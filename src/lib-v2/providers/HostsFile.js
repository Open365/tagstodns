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

var settings = require('../../settings.js');
var fs = require('fs');

var HostsFile = function (injectedSettings, injectedFs) {
    this.settings = injectedSettings || settings;
    this.fs = injectedFs || fs;
};

HostsFile.prototype.save = function (data, cb) {
    var parsedData = this.__parseDataIntoHosts(data);
    this.__writeEntry(parsedData, cb);
};

HostsFile.prototype.update = function (ip, data, cb) {
    var self = this;
    console.log('HostsFile:', ip, data);
    this.delete(ip, data, function (error) {
        if (!error) {
            self.save(data, cb);
        } else {
            throw error;
        }
    });
};

HostsFile.prototype.delete = function (ip, tag, cb) {
    var hostsFile = this.settings.hostsFile.tempPath;
    var self = this;
    this.fs.readFile(hostsFile, function (error, data) {
        if (error) {
            if (error.code === 'ENOENT') {
                if (typeof cb === 'function') {
                    cb();
                }
                return;
            }
            throw error;
        }

        var lines = data.toString('utf8').split('\n');
        console.log('lines ----------------', lines);
        var newLines = lines.filter(function (line) {
            var chunks = line.split('#');
            if(!chunks[1]){
                chunks[1] = '';
            }
            return chunks[1].trim() !== tag.id;
        });
        console.log('HostsFile.delete', newLines.join('\n'));
        self.fs.writeFile(hostsFile, newLines.join('\n'), cb);
    });
};

HostsFile.prototype.__writeEntry = function (hostsData, cb) {
    console.log('HostsFile.writeEntry', hostsData);
    this.fs.appendFile(this.settings.hostsFile.tempPath, hostsData, cb);
};

// Input data: An object where each key=ip and value=array of hostnames
HostsFile.prototype.__parseDataIntoHosts = function (data) {
    var hostFile = '';
    var self = this;
    for (var key in data) {
        if (data.hasOwnProperty(key) && key != 'id' && key != 'hostName') {
            hostFile = hostFile + key + '\t';
            var hostsArray = data[key];
            hostsArray.forEach(function (host) {
                hostFile = hostFile + host + self.settings.dnsDomain + ' ';
            });
            hostFile = hostFile + '\t' + data.hostName + ' #' + data.id + '\n';
        }
    }
    return hostFile;
};

module.exports = HostsFile;
//1bf3576eb7f6=rabbit:172.17.0.158:0
