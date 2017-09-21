//import util funcitons
var utils = require('./utils.js');

//snapshot Volume
var snapshotVolume = (Volume) => {
  var thisVolumeId = Volume.VolumeId
  var timeString = utils.getDateTimeString();
  if (Volume.Attachments[0]) {
    var volumeInstance =  Volume.Attachments[0].InstanceId
    var volumeMapping = Volume.Attachments[0].Device
    var params = {
      DryRun: false,
      VolumeId: thisVolumeId,
      Description: `${thisVolumeId} - attached at ${volumeMapping} on ${volumeInstance} - ${timeString} UTC`
    };
  } else {
    var params = {
      DryRun: false,
      VolumeId: thisVolumeId,
      Description: `${thisVolumeId} - not attached to an instance - ${timeString} UTC`
    };
  }

  return new Promise((resolve, reject) => {
    ec2.createSnapshot(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  snapshotVolume
};
