var natural = require('natural');
var classifier = new natural.BayesClassifier();

function normalize(json_list){
    var labels = 5;
    var total_sum = 0;

    for (let i = 0; i < labels; i ++){
        total_sum = total_sum + json_list[i]["value"];
    }

    for (let i = 0; i < labels; i ++){
        json_list[i]["value"] = json_list[i]["value"] / total_sum;
    }

    return json_list
}


classifier.addDocument("Can I get automatic refills for my medications?", "Prescription Refill");
classifier.addDocument("Can I obtain an early refill of my medications?", "Prescription Refill");
classifier.addDocument("How do I order a refill for a medication I get through delivery?", "Prescription Refill");
classifier.addDocument("Refill", "Prescription Refill");
classifier.addDocument("How do I refill my meds?", "Prescription Refill");
classifier.addDocument("How do I sign up for automatic refill system?", "Prescription Refill");
classifier.addDocument("How do I enroll for automatic refill system?", "Prescription Refill");
classifier.addDocument("What is the automatic refill system?", "Prescription Refill");
classifier.addDocument("How do I get more medication beyond my existing prescription limit", "Prescription Refill");
classifier.addDocument("What is the prescription limit during each automatic refill?", "Prescription Refill");
classifier.addDocument("How do I enable automatic refill?", "Prescription Refill");
classifier.addDocument("Do I need a prescription to enable refill?", "Prescription Refill");


classifier.addDocument("What is DrugHub?", "About Us");
classifier.addDocument("Is there a mobile app for DrugHub?", "About Us");
classifier.addDocument("Is there a website for DrugHub?", "About Us");
classifier.addDocument("Describe DrugHub", "About Us");
classifier.addDocument("What does DrugHub do?", "About Us");
classifier.addDocument("How does DrugHub work?", "About Us");
classifier.addDocument("Explain the procedural operations of DrugHub", "About Us");


classifier.addDocument("How do I know if I am a DrugHub member?", "Subcription Plan");
classifier.addDocument("Who do I speak to if I have a question about my subscription plan?", "Subcription Plan");
classifier.addDocument("Where do I find my DrugHub member ID?", "Subcription Plan");
classifier.addDocument("How much does a Premium Membership cost?", "Subcription Plan");
classifier.addDocument("What percentage of DrugHub users are premium subscribers?", "Subcription Plan");
classifier.addDocument("Is the subscription plan recurring(i.e. renews automatically)?", "Subcription Plan");

classifier.addDocument("How do I get started with home delivery?", "Home Delivery");
classifier.addDocument("What medications can be delivered?", "Home Delivery");
classifier.addDocument("How do you ship my medication?", "Home Delivery");
classifier.addDocument("If I have my medication delivered, can I still talk to a pharmacist?", "Home Delivery");
classifier.addDocument("Can I get all my medications delivered?", "Home Delivery");
classifier.addDocument("Is it safe to get my medications delivered?", "Home Delivery");
classifier.addDocument("Is there a way to get medicine shipped to my house?", "Home Delivery");
classifier.addDocument("Is there a way to get medicine sent to my house?", "Home Delivery");
classifier.addDocument("How is medication sent to my home?", "Home Delivery");
classifier.addDocument("Who delivers the medication to my home?", "Home Delivery");
classifier.addDocument("Why is home delivery a good option?", "Home Delivery");
classifier.addDocument("How do I get my medication sent to my place of residence?", "Home Delivery");
classifier.addDocument("Once the medication is ready at the Pharmacy, how is it sent to my house?", "Home Delivery");

classifier.addDocument("How do I contact DrugHub?", "Contact Us");
classifier.addDocument("Who do I call if I have additional questions or need help?", "Contact Us");
classifier.addDocument("Are there representatives I can speak to?", "Contact Us");
classifier.addDocument("Contact Information for DrugHub", "Contact Us");
classifier.addDocument("Reaching out to Representatives", "Contact Us");
classifier.addDocument("What do I do if I need help with the medication instructions?", "Contact Us");


classifier.train();

question = "Who do I contact for support?";
console.log(normalize(classifier.getClassifications(question)));
console.log(natural.PorterStemmer.tokenizeAndStem(question).sort());

article = "Avoid going to a pharmacy with home delivery!";

console.log(natural.PorterStemmer.tokenizeAndStem(article).sort());