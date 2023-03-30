const bucket = require("./firebase").bucket;
const stream  = require('stream');

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


async function uploadDocumentation(uid, rawFileData, response){
    if (uid == null){
        uid = "TEST";
    }

    console.log("Time to upload documentation");
    console.log("UID: " + uid);
    console.log("Raw File Length: " + rawFileData.length);

    console.log("Going to upload data from memory");
    //await uploadFromMemory(`user-file/${uid}.jpeg`, rawFileData, response).catch(console.error);

    dataStream = new stream.PassThrough();
    gcFile = bucket.file(`user-file/${uid}.jpeg`)

    dataStream.push(rawFileData)
    dataStream.push(null)

    await new Promise((resolve, reject) => {
    dataStream.pipe(gcFile.createWriteStream({
        resumable  : false,
        validation : false,
        metadata   : {'Cache-Control': 'public, max-age=31536000'}
    }))
    .on('error', (error) => { 
        reject(error) 
    })
    .on('finish', () => { 
        console.log("Writing Data has been done!");
        resolve(true)
    })
    })

}
module.exports = {
    uploadDocumentation: uploadDocumentation
}