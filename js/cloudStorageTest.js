/////TEST CLOUD STORAGE

const bucket = require("./firebase").bucket;

var file_name = "../images/facebook.png"

bucket.upload(file_name)
.then((uploadResponse) => {
    console.log(uploadResponse);
    console.log("File Uploaded!");
})