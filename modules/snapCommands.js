//import util funcitons
var utils = require('./utils.js');

//snapshot Volume
var snapshotVolume = (Volume) => {
  var thisVolumeId = Volume.VolumeId
  var timeString = utils.getDateTimeString();
  var params = {
    DryRun: false,
    VolumeId: thisVolumeId,
    Description: `Snapshot of volume ${thisVolumeId} created at ${timeString} UTC`
  };
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
