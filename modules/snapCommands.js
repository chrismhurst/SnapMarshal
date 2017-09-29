//import util funcitons
var utils = require('./utils.js');

//snapshot the volume
//.then tag the snapshot
//.then tag the volume with the last backed up tag
//.then resolve the promise
var snapshotAndTag = (Volume) => {
  return new Promise((resolve, reject) => {
    snapshotVolume(Volume).then((res) => {
      var SnapshotId = [res.SnapshotId];
      var Tags = Volume.Tags;
      return tagResource(SnapshotId, Tags);
    }).then((res) => {
      var VolumeId = [Volume.VolumeId];
      var TimeStamp = utils.getDateTimeString();
      var Tags = [
        {
          "Key": "LastBackupTime",
          "Value": `${TimeStamp}`
        }
      ]
      return tagResource(VolumeId, Tags);
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      console.log(err);
    })
  });
};

//tag resource
var tagResource = (ResourceID, Tags) => {
  return new Promise((resolve, reject) => {
    var params = {
      DryRun: false,
      Resources: ResourceID,
      Tags: Tags
    }
    ec2.createTags(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//snapshot Volume with a useful description
var snapshotVolume = (Volume) => {
  return new Promise((resolve, reject) => {
    var thisVolumeId = Volume.VolumeId
    var timeString = utils.getDateTimeString();
    if (Volume.Attachments[0]) {
      var volumeInstance =  Volume.Attachments[0].InstanceId
      var volumeMapping = Volume.Attachments[0].Device
      var volumeTags = Volume.Tags
      var params = {
        DryRun: false,
        VolumeId: thisVolumeId,
        Description: `${thisVolumeId} - attached at ${volumeMapping} on ${volumeInstance} - ${timeString} UTC`,
      };
    } else {
      var params = {
        DryRun: false,
        VolumeId: thisVolumeId,
        Description: `${thisVolumeId} - not attached to an instance - ${timeString} UTC`,
      };
    }
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
  snapshotVolume,
  tagResource,
  snapshotAndTag
};
