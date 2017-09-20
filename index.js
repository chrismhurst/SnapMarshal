//AWS SDK Reference: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVolumes-property

//import aws sdk
var AWS = require('aws-sdk');

//import volume functions
var volCommands = require('./modules/volCommands.js')

//import snapshot functions
var snapCommands = require('./modules/snapCommands.js');

//set region
AWS.config.update({region: 'us-east-1'});

//create ec2 instance
ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

exports.handler = function (event, context) {
    volCommands.getVolumesToBackup(event).then((res) => {
      return Promise.all(res.map(snapCommands.snapshotVolume));
    }).then((res) => {
      context.succeed(res);
    }).catch((err) => {
      console.log(err);
    });
};
