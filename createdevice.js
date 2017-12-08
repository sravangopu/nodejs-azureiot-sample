'use strict';

var iothub = require('azure-iothub');
const uuidv4 = require('uuid/v4');
var fs = require('fs'),
    parseString = require('xml2js').parseString,
	xml2js = require('xml2js');

var connectionString = '{iothub connection string}';

var registry = iothub.Registry.fromConnectionString(connectionString);


fs.readFile('DeviceConfiguration.xml', 'utf-8', function (err, data){
    
    parseString(data, function(err, result){
        if(err) console.log(err);
		
        var json = result;
		
		if(json.DeviceConfig.Id == null || json.DeviceConfig.Id == '')
		{
			var id = uuidv4();
			var device = {
				deviceId: id
				}

			registry.create(device, function(err, deviceInfo, res) {
			  if (err) {
				  console.log('Error in creating device');
				  registry.get(device.deviceId, printDeviceInfo);
			  }
			  if (deviceInfo) {
				  console.log('Device created successfully!!');
				  writeInfoToXml()					
				  printDeviceInfo(err, deviceInfo, res)
			  }
			});

			function printDeviceInfo(err, deviceInfo, res) {
			  if (deviceInfo) {
				console.log('Device ID: ' + deviceInfo.deviceId);
				console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
			  }
			}
			
			function writeInfoToXml(){
				json.DeviceConfig.Id = id;
				var builder = new xml2js.Builder();
				var xml = builder.buildObject(json);
				fs.writeFile('DeviceConfiguration.xml', xml, function(err, data){
				if (err) console.log(err);
				})
			}			
		}
		else
			console.log('Oops device with the same Device Id exists already!!');
    });
});    

