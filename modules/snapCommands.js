//import util funcitons
var utils = require('./utils.js');

//import feedback functions
var feedback = require('./feedback.js');

//snapshot the volume
//.then tag the snapshot
//.then add a result entry to feedback and tag the volume with the last backed up tag
//.then resolve the promise
var snapshotAndTag = (Volume) => {
  return new Promise((resolve, reject) => {
    snapshotVolume(Volume).then((res) => {
      // var SnapshotId = [res.SnapshotId];
      // var Tags = Volume.Tags;
      feedback.feedback(Volume.VolumeId, res.SnapshotId, 'Created');
      return tagResource([res.SnapshotId], Volume.Tags);
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



//var getVolumeSnaps
var getSnapshotsByVolume = (Volume) => {
  return new Promise((resolve, reject) => {
    var params = {
      DryRun: false,
      Filters: [
        {
        Name: "volume-id",
        Values: [
          Volume.VolumeId
        ]
      }
      ]
    }
    ec2.describeSnapshots(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//var selectVolumeSnapsByDate

//var removeSnapshot

var manageRetainedVolumeSnapshots = (Volume) => {
  return new Promise((resolve, reject) => {
    getSnapshotsByVolume(Volume).then((res) => {
      resolve(res);
    }).catch((err) => {
      console.log(err);
    });
  });

  //select only snaps that actually exceed retention limit

  //remove selected snaps
};

module.exports = {
  snapshotVolume,
  tagResource,
  snapshotAndTag,
  manageRetainedVolumeSnapshots
};
