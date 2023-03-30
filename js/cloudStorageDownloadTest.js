const bucket = require("./firebase").bucket;


async function downloadIntoMemory(fileName) {
    // Downloads the file into a buffer in memory.
    const contents = await bucket.file(fileName).download();

    console.log(
      `Contents of gs://swe-spring-2023.appspot.com/${fileName} are ${contents.toString()}.`
    );
}


downloadIntoMemory("LBTuOwWyRQauaICZmcprWELyzVY2/lec1_introduction.pdf");
