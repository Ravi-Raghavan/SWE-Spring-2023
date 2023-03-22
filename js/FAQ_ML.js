//Create ML Model for FAQ

const fs = require("fs");
const { parse } = require("csv-parse");
var natural = require('natural');
var categoryClassifier = new natural.BayesClassifier();
var intentClassifier = new natural.BayesClassifier();


async function train(){
    training_data = []

    return new Promise(function (resolve, reject){
        fs.createReadStream("../csv/FAQ_Training.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            training_data.push(row)
            categoryClassifier.addDocument(row[0], row[6]);
            intentClassifier.addDocument(row[0], row[1]);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            
            categoryClassifier.train();
            intentClassifier.train();

            resolve(training_data);
        })
        .on('error', reject);
    })
}

async function test(){
    var categoryClassifierSuccesses = 0
    var categoryClassifierFailures = 0

    var intentClassifierSuccesses = 0
    var intentClassifierFailures = 0

    return new Promise(function (resolve, reject){
        fs.createReadStream("../csv/FAQ_Test.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            var category = categoryClassifier.classify(row[0]);
            if (category === row[6]){
                categoryClassifierSuccesses = categoryClassifierSuccesses + 1;
            }
            else{
                categoryClassifierFailures = categoryClassifierFailures + 1;
            }

            var intent = intentClassifier.classify(row[0]);
            if (intent === row[1]){
                intentClassifierSuccesses = intentClassifierSuccesses + 1;
            }
            else{
                intentClassifierFailures = intentClassifierFailures + 1;
            }

        })
        .on('end', () => {
            console.log("Category Successes: " + categoryClassifierSuccesses);
            console.log("Category Failures: " + categoryClassifierFailures);
            console.log("Intent Successes: " + intentClassifierSuccesses);
            console.log("Intent Failures: " + intentClassifierFailures);

            resolve(categoryClassifierSuccesses);
        })
        .on('error', reject);
    })
}


async function evaluate(){
    await train();
    await test();

    categoryClassifier.save('../json/CategoryBayesianClassifier.json', function(err, categoryClassifier) {
        // the classifier is saved to the CategoryBayesianClassifier.json file!
    });

    intentClassifier.save('../json/IntentBayesianClassifier.json', function(err, intentClassifier) {
        // the classifier is saved to the IntentBayesianClassifier.json file!
    });
}

evaluate();
