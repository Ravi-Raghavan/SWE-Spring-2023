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
//my own: consumer
classifier.addDocument("How do I disable automatic refill?", "Prescription Refill");
classifier.addDocument("Are automatic refills free?", "Prescription Refill");
classifier.addDocument("Are automatic refills better than manual refills?", "Prescription Refill");
classifier.addDocument("Can I change my automatic refills?", "Prescription Refill");
classifier.addDocument("Can I change when my medication needs to be refilled?", "Prescription Refill");
//my own: doctor
classifier.addDocument("Can I autimatically refill my patients' medication?", "Prescription Refill");
classifier.addDocument("Can I cancel the refills of my patients?", "Prescription Refill");
classifier.addDocument("Can I control my patients' refills?", "Prescription Refill");



classifier.addDocument("What is DrugHub?", "About Us");
classifier.addDocument("Is there a mobile app for DrugHub?", "About Us");
classifier.addDocument("Is there a website for DrugHub?", "About Us");
classifier.addDocument("Describe DrugHub", "About Us");
classifier.addDocument("What does DrugHub do?", "About Us");
classifier.addDocument("How does DrugHub work?", "About Us");
classifier.addDocument("Explain the procedural operations of DrugHub", "About Us");
//my own
classifier.addDocument("Where is DrugHub located?", "About Us");
classifier.addDocument("What brands are DrugHub allowed to deliver?", "About Us");
classifier.addDocument("What can DrugHub deliver?", "About Us");
classifier.addDocument("Who owns DrugHub?", "About Us");
classifier.addDocument("What is DrugHub's vision?", "About Us");
classifier.addDocument("DrugHub security", "About Us");
classifier.addDocument("DrugHub partners", "About Us");
classifier.addDocument("Is DrugHub based on Breaking Bad?", "About Us"); //:D
classifier.addDocument("What services do DrugHub provide?", "About Us");
classifier.addDocument("Where does DrugHub Deliver?", "About Us");
classifier.addDocument("Is DrugHub available outside the US?", "About Us");
//my own: doctor
classifier.addDocument("What can DrugHub do for doctors?", "About Us");
classifier.addDocument("How does DrugHub work for doctors?", "About Us");
classifier.addDocument("What kind of Doctors can use DrugHub?", "About Us");
classifier.addDocument("How can doctors use DrugHub?", "About Us");
classifier.addDocument("Can I trust DrugHub with my patients' medication?", "About Us");
classifier.addDocument("Can I use my doctor's account to get medication for myself?", "About Us");
classifier.addDocument("How can I get a doctor's account?", "About Us");






classifier.addDocument("How do I know if I am a DrugHub member?", "Subscription Plan");
classifier.addDocument("Who do I speak to if I have a question about my subscription plan?", "Subscription Plan");
classifier.addDocument("Where do I find my DrugHub member ID?", "Subscription Plan");
classifier.addDocument("How much does a Premium Membership cost?", "Subscription Plan");
classifier.addDocument("What percentage of DrugHub users are premium subscribers?", "Subscription Plan");
classifier.addDocument("Is the subscription plan recurring(i.e. renews automatically)?", "Subscription Plan");
//my own: consumer
classifier.addDocument("Cancel my subscription", "Subscription Plan");
classifier.addDocument("Can I have one membership for multiple people?", "Subscription Plan");
classifier.addDocument("How old do I have to be to be a member?", "Subscription Plan");
classifier.addDocument("Can I order medication for my kids?", "Subscription Plan");
classifier.addDocument("How do I pay for a subscription?", "Subscription Plan");
classifier.addDocument("Payments", "Subscription Plan");
//my own: doctor
classifier.addDocument("Tiers", "Subscription Plan");
classifier.addDocument("Can I change my subscription plan if I get my degree?", "Subscription Plan");
classifier.addDocument("Can I get a doctor's subscription if I'm still in med school?", "Subscription Plan");
classifier.addDocument("How much more can a doctors account access?", "Subscription Plan");
classifier.addDocument("How can I get a doctor's account?", "Subscription Plan");


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
//my own: consumer
classifier.addDocument("Where is my package?", "Home Delivery");
classifier.addDocument("Where is my order?", "Home Delivery"); 
classifier.addDocument("Where is my delivery?", "Home Delivery");
classifier.addDocument("Can I track my order?", "Home Delivery");
classifier.addDocument("How can I track my order?", "Home Delivery");
classifier.addDocument("How can I track my package?", "Home Delivery");
classifier.addDocument("Can I track my package?", "Home Delivery");
//my own: doctor
classifier.addDocument("Can I track my patients' packages?", "Home Delivery");
classifier.addDocument("Can I track my patients' orders?", "Home Delivery");


classifier.addDocument("How do I contact DrugHub?", "Contact Us");
classifier.addDocument("Who do I call if I have additional questions or need help?", "Contact Us");
classifier.addDocument("Are there representatives I can speak to?", "Contact Us");
classifier.addDocument("Contact Information for DrugHub", "Contact Us");
classifier.addDocument("Reaching out to Representatives", "Contact Us");
classifier.addDocument("What do I do if I need help with the medication instructions?", "Contact Us");
//my own: 
classifier.addDocument("Refunds", "Contact Us");
classifier.addDocument("Can I get a refund?", "Contact Us");
classifier.addDocument("Who do I talk to about refunds?", "Contact Us");
classifier.addDocument("Where do I go to get a refund?", "Contact Us");
classifier.addDocument("I don't see my question", "Contact Us");





classifier.addDocument("How do I place an order?", "Placing an Order");
classifier.addDocument("Orders", "Placing an Order");
classifier.addDocument("How much does it cost to place an order?", "Placing an Order")
classifier.addDocument("Do we get unlimited orders?", "Placing an Order")
classifier.addDocument("What is the cancellation policy for orders?", "Placing an Order")
classifier.addDocument("How long do orders take to get verified?", "Placing an Order")
classifier.addDocument("How long are we to wait to place an order after already placing an order?", "Placing an Order")
classifier.addDocument("Benefits of ordering medication through DrugHUb", "Placing an Order")
classifier.addDocument("Why should I order medication here? Why not just go to Amazon?", "Placing an Order")
classifier.addDocument("How do I purchase medication?", "Placing an Order");
classifier.addDocument("Purchases", "Placing an Order");
classifier.addDocument("How much does it cost to purchase medication?", "Placing an Order")
classifier.addDocument("Do we get unlimited purchases?", "Placing an Order")
classifier.addDocument("What is the cancellation policy for purchases?", "Placing an Order")
classifier.addDocument("How long do purchases take to get verified?", "Placing an Order")
classifier.addDocument("How long are we to wait to place an purchases after already placing an order?", "Placing an Order")
classifier.addDocument("Benefits of purchases medication through DrugHub", "Placing an Order")
classifier.addDocument("Why should I purchases medication here? Why not just go to Amazon?", "Placing an Order")
//my own: consumer
classifier.addDocument("What's the difference between ordering an off-the-counter item and a perscription item?", "Placing an Order");
classifier.addDocument("Are there different order limits for specific items?", "Placing an Order");
classifier.addDocument("Are there different order limits for off-the-counter items and perscription items?", "Placing an Order");
classifier.addDocument("Are there different order limits for children's items and adult items?", "Placing an Order");
classifier.addDocument("Can I max out different limits in my cart?", "Placing an Order");
classifier.addDocument("How many items can i store in my cart?", "Placing an Order");
classifier.addDocument("Payments", "Placing an Order");
classifier.addDocument("Do you accept my insurance plan?", "Placing an Order");
classifier.addDocument("Do you accept my credit cards?", "Placing an Order");
classifier.addDocument("Do you accept PayPal?", "Placing an Order");
classifier.addDocument("Do you accept Venmo?", "Placing an Order");
classifier.addDocument("Do you accept Cashapp?", "Placing an Order");
classifier.addDocument("Do you accept Chuck E. Cheese tokens?", "Placing an Order");




classifier.train();

//question = "Where can I purchase a membership?";
question = "Payments";
console.log(normalize(classifier.getClassifications(question)));
console.log(natural.PorterStemmer.tokenizeAndStem(question).sort());

article = "Avoid going to a pharmacy with home delivery!";

console.log(natural.PorterStemmer.tokenizeAndStem(article).sort());