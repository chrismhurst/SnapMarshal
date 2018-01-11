//get all volumes with tag:Backup with value:true
var getVolumesToBackup = (event) => {
  return new Promise((resolve, reject) => {
    //set params to grab all volumes with tag:Backup value:true
    var params = {
      DryRun: false,
      Filters: [
        {
          Name: `tag:${event.BackupTag.tag}`,
          Values: [
            event.BackupTag.value
          ]
        }
      ]
    }
    ec2.describeVolumes(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Volumes);
        }
      });
  });
};

//get all volumes with retention management tags
var getVolumesWithRetentionTags = (event) => {
  return new Promise((resolve, reject) => {
    //set params to grab all volumes with tag:Retention and tag:RetentionType
    var params = {
      DryRun: false,
      Filters: [
        {
          Name: `tag-key`,
          Values: [
            event.RetentionTags.RetentionTag,
            event.RetentionTags.RetentionTypeTag
          ]
        }
      ]
    }
    ec2.describeVolumes(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Volumes);
      }
    });
  });
};

module.exports = {
  getVolumesToBackup,
  getVolumesWithRetentionTags
};
