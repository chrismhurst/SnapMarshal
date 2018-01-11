//AWS SDK Reference: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVolumes-property

//import aws sdk
var AWS = require('aws-sdk');

//import volume functions
var volCommands = require('./modules/volCommands.js')

//import snapshot functions
var snapCommands = require('./modules/snapCommands.js');

//import feedback functions
var feedback = require('./modules/feedback.js');

//set region
AWS.config.update({region: 'us-east-1'});

//create ec2 instance
ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

//get volumes based on filter passed in custom event
//.then snapshot and tag all volumes returned
//.then return successful to Lambda
exports.handler = function (event, context) {
  if (event.BackupTag) {
    volCommands.getVolumesToBackup(event).then((res) => {
      return Promise.all(res.map(snapCommands.snapshotAndTag));
    }).then((res) => {
      context.succeed(feedback.feedbackContent);
    }).catch((err) => {
      console.log(err);
    });
  }
  if (event.RetentionTags) {
    volCommands.getVolumesWithRetentionTags(event).then((res) => {
      return Promise.all(res.map(snapCommands.manageRetainedVolumeSnapshots))
    }).then((res) => {
      context.succeed(res);
    }).catch((err) => {
      console.log(err);
    })
  }
};
