const bucket = require("./firebase").bucket;
var fs = require('fs');
const path = require('path');   
const filePath = path.join(__dirname, 'start.html');

async function uploadFromMemory(destFileName, contents, response) {

    fs.readFile("/Users/raviraghavan/Desktop/Undergrad BS CS:CE/Undergrad Junior Year/Spring 2023 Semester/SWE/images/reddit.png", {encoding: 'utf-8'}, function(err, data){
        if (!err) {
            bucket.file(destFileName).save(data)
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
        else {
            console.log(err);
        }
    });
  }


async function uploadDocumentation(uid, rawFileData, response){
    if (uid == null){
        uid = "TEST";
    }

    console.log("Time to upload documentation");
    console.log("UID: " + uid);
    console.log("Raw File Length: " + rawFileData.length);

    console.log("Going to upload data from memory");
    await uploadFromMemory(`user-destination/${uid}.jpeg`, rawFileData, response).catch(console.error);

}
module.exports = {
    uploadDocumentation: uploadDocumentation
}