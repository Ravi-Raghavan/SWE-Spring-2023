//Create a Bayesian Classifier to classify FAQ Questions. Model will be trained, compiled, and stored in a folder to be accessed for later use 
var natural = require('natural');
var fileName = "./test/BayesianClassifier.json";
natural.BayesClassifier.load(fileName, null, function(err, classifier) {
    console.log(classifier.classify('How do I get medicine?'));
    console.log(classifier.classify('How is medication delivered to my house?'));
});

