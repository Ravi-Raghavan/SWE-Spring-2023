//test file to create a bunch of dummy FAQ files and store them in firebase 
const admin = require("../firebase").admin;
var db = admin.database();
var ref = db.ref("/FAQ/");


async function populateFAQ(){
    for (let i = 1; i <= collection_size; i ++){
        var article_json = FAQ_collection[i - 1];
        console.log(article_json);
        var uid = `article_${i}`;
        await ref.child(`${uid}`).set(
            {
                title: article_json.title,
                content: article_json.content,
                topics: article_json.topics
            }
        )
        console.log(`DONE with ${uid}`);
    }
}

let collection_size = 20

let FAQ_collection = [
    {
        title: "Can I get refills for my medication?",

        content: "Yes! DrugHub allows its members to put in their prescription information, and will allow the option to either manually or automatically refill your medication.",

        topics: ["Prescription Refill"]
    },

    {
        title: "Can DrugHub automatically renew my medication?",

        content: "Yes! Members have the option to allow DrugHub to automatically ask you via email if you need your medication refilled, where they can answer yes or no; members who click yes can expect their refill to arrive within 1 to 2 business days. Members who click no can either cancel their automatic refill status or wait until another email asking if they need a refill.", 
        topics: ["Prescription Refill"]
    },

    {
        title: "How do I sign up for automatic refills?",

        content: "There are 2 ways to set up your refills. When you put in your prescription information, you will be given an option to apply for automatic refills. You can also manually set up refills in your profile.",
        topics: ["Prescription Refill"]
    },

    {
        title: "Can I see my prescription history online?",

        content: "You have the option to view and print your prescription records, which include detailed information about said prescriptions, and the time and dates of the prescriptions , and set up refill reminders.",

        topics: ["Prescription Refill"]
    },

    {
        title: "How can I find out if a generic equivalent is available for my prescription?",

        content: "Once your prescription information is in our database, you’ll be notified when a generic equivalent becomes available, where you can then refill with the generic product or with your current prescription. ",

        topics: ["Prescription Refill"]
    },

    {
        title: "If I’m a doctor, can I control patients’ refills?",

        content: "Yes, if you’re a Doctor and you have a medical reason why your patient needs to stay with the brand you prescribed them, they will not be given the option for a generic equivalent.",

        topics: ["Prescription Refill"]
    },
    {
        title: "What is DrugHub?",

        content: "DrugHub is a delivery service for medication that can be used by both patients and doctors to reduce the amount of exposure to COVID 19 when going to a pharmacy.",

        topics: ["About Us"]
    },

    {
        title: "Why was DrugHub founded?",

        content: "During the COVID-19 pandemic, many people either couldn’t and/or wouldn’t go out and get the medication they needed, which included prescription and off the counter products. DrugHub was founded so people can get their medication delivered right to their door without exposing themselves to the virus.",

        topics: ["About Us"]
    },

    {
        title: "How Can DrugHub help Doctors?",

        content: "Doctors can use DrugHub to facilitate the prescription and doses of patients medications and control their prescription refills if need be. ",

        topics: ["About Us"]
    },


    {
        title: "How much does a Premium Membership Cost?",

        content: "Premium comes at a cost of $11.99 before tax.",

        topics: ["Subscription Plan"]
    },

    {
        title: "How can I pay for a subscription?",

        content: "Users can simply click on “become a member” on the home page and they will be guided through the payment process. ",

        topics: ["Subscription Plan"]
    },

    {
        title: "What type of payments does DrugHub accept?",

        content: "DrugHub accepts Paypal, Venmo, and credit/debit cards from American Express, Visa, Master Card, or Discover. ",

        topics: ["Subscription Plan"]
    },

    {
        title: "Who delivers my medication?",

        content: "Ask Abid and Ravi, but as of right now, kind of like an Uber/Uber Eats service.",

        topics: ["Home Delivery"]
    },

    {
        title: "Where does DrugHub deliver to?",

        content: "DrugHub has services available throughout the United States only.",


        topics: ["Home Delivery"]
    },


    {
        title: "Is there a cart limit?",

        content: "As DrugHub deals in delivering medication, these limits are set in place so one does not order too much medication within a specific time frame. ",

        topics: ["Placing an Order"]
    },

    {
        title: "Can I cancel or edit an order already submitted?",

        content: "Once an Order is submitted, you are given a 30 minute window before the order is finalized to make any edits to your order, including cancellation. After the 30 minute window, the order is finalized and your payment is charged.",

        topics: ["Place an Order"]
    },

    {
        title: "Can I get a refund on my order?",

        content: "Members can receive compensation if the delivery never hasn’t been made within 2 business days or **add detail later**. ",

        topics: ["Place an Order"]
    },


    {
        title: "Don’t See Your Question?",

        content: "Contact Us",

        topics: ["Contact Us"]
    },



    {
        title: "How do I get my refunds?",

        content: "If your order never arrives within 2 business days or **add detail later**, then you can contact a representative about getting a partial refund. ",

        topics: ["Place an Order"]
    }
   
]


populateFAQ();
console.log("Done");
