//Create ML Model for FAQ

const fs = require("fs");
const { parse } = require("csv-parse");
var natural = require('natural');
var classifier = new natural.BayesClassifier();


async function train(){
    training_data = []

    return new Promise(function (resolve, reject){
        fs.createReadStream("../csv/FAQ_Training.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            training_data.push(row)
            classifier.addDocument(row[0], row[6]);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            classifier.train();
            resolve(training_data);
        })
        .on('error', reject);
    })
}

async function test(){
    var successes = 0
    var failures = 0

    return new Promise(function (resolve, reject){
        fs.createReadStream("../csv/FAQ_Test.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            var category = classifier.classify(row[0]);
            if (category === row[6]){
                successes = successes + 1;
            }
            else{
                failures = failures + 1;
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log("Successes: " + successes);
            console.log("Failures: " + failures);
            resolve(successes);
        })
        .on('error', reject);
    })
}


async function evaluate(){
    await train();
    await test();

    classifier.save('../json/BayesianClassifier.json', function(err, classifier) {
        // the classifier is saved to the classifier.json file!
    });
}

evaluate();
