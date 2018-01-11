//get all volumes with tag:Backup with value:true
var getVolumesToBackup = (event) => {
  return new Promise((resolve, reject) => {
    //set params for to grab all volumes with tag:Backup value:true
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

module.exports = {
  getVolumesToBackup
};
