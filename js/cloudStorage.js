const bucket = require("./firebase").bucket;

async function uploadFromMemory(destFileName, contents, response) {

    bucket.file(destFileName).save(contents)
    .then(() => {
        console.log("SUCCESS");
          response.writeHead(200, { "Content-type": "text/plain" });
          response.write("Successfully Uploaded File");
          response.end();
    })
    .catch((error) => {      
        console.log("FAILURE");
          response.writeHead(404, { "Content-type": "text/plain" });
          response.write("Couldn't Upload File");
          response.end();
    })
  }


function uploadDocumentation(uid, rawFileData, response){
    if (uid == null){
        uid = "TEST";
    }

    console.log("Time to upload documentation");
    console.log("UID: " + uid);
    console.log("Raw File Length: " + rawFileData.length);

    console.log("Going to upload data from memory");
    uploadFromMemory(`user-destination/${uid}.jpeg`, rawFileData, response).catch(console.error);

}
module.exports = {
    uploadDocumentation: uploadDocumentation
}