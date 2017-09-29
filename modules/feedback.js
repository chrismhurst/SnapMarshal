//define object that we will be adding feedback content to
var feedbackContent = {
  Results: []
}

//function to build a json object we can return
//needs to be fed the VolumeId, SnapshotId, and the Operation completed in past tense
var feedback = (VolumeId, SnapshotId, Operation) => {
  feedbackContent.Results.push(
    {
      "SnapshotId": `${SnapshotId}`,
      "OriginatingVolume": `${VolumeId}`,
      "Status": `${Operation}`
    }
  );
};

module.exports = {
  feedbackContent,
  feedback
}
