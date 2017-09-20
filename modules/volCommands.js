//get all volumes with tag:Backup with value:true
var getVolumesToBackup = () => {
  //set params for to grab all volumes with tag:Backup value:true
  var params = {
    DryRun: false,
    Filters: [
      {
        Name: 'tag:Backup',
        Values: [
          'true'
        ],
      }
    ]
  }
  return new Promise((resolve, reject) => {
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
