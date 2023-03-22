const admin = require("./firebase").admin;
var db = admin.database();
var FAQ_ref = db.ref("/FAQ/");

/**
 * ACCOUNT
 */
//create_account questions and answers
create_account = {"How do I create an account?": "From the Homepage, hover over the profile Icon and click Log In. Then, click Create An Account.",
                "Is there an email validation process to create an account?": "Yes, there is an email validation process to create an account."}

//delete_account questions and answers
delete_account = {"How do I delete an account?": "Visit the Account Dashboard, Go to Settings, and Click Delete Account"}

//edit_account questions and answers
edit_account = {"How do I edit the information in my account?": "Visit the account dashboard and edit information"}

//recover_password
recover_password = {"How do I recover my password?": "Through the Account Dashboard"}

//registration_problems
registration_problems = {"I am having registration issues. How do I proceed?": "Check to make sure all the information you entered is correct"}

//switch_account
switch_account = {"Can I switch accounts?": "You must log out of one account and log in to the other"}


/**
 * CANCELLATION_FEE
 */
//check_cancellation_fee
check_cancellation_fee = {"What is the cancellation fee for DrugHub?": "If you do not cancel your order within 24 hours, you will be charged a cancellation fee of $20"}


/**
 * CONTACT
 */
//contact_customer_service
contact_customer_service = {"How do I contact customer service?": "Please fill the form on our Contact Us Page"}

//contact_human_agent
contact_human_agent = {"How do I contact a human agent?": "Please dial the phone number you see on our Contact Us Page"}



/**
 * DELIVERY
 */

//delivery_options
delivery_options = {"What are the delivery options for DrugHub?": "DrugHub solely does home delivery"}

//delivery_period
delivery_period = {"How long do products take to get delivered?": "Expect around 3-5 business days"}


/**
 * INVOICE
 */

check_invoice = {"Where do I see my invoice?": "Check it on your account dashboard!"}
get_invoice = {"How do I get my invoice?": "Your invoice can be obtained by downloading it as a PDF from the account dashboard"}

/**
 * NEWSLETTER
 */
newsletter_subscription = {"How does the newsletter subscription work?": "You will receive monthly newsletters if you are a DrugHub Premium Member"}

/**
 * ORDER
 */
cancel_order = {"How do I cancel an order?": "You can cancel from 24 hours of your purchase"}
change_order = {"Can I change my order after purchase?": "No, you cannot"}
place_order = {"How can I place an order?": "You can place an order by going to the Cart page, adding your medication to your cart, and clicking PURCHASE"}
track_order = {"Can I track my order?": "You can track your order by going to the delivery page"}

/**
 * PAYMENT
 */
check_payment_methods = {"How do I view my payment methods?": "Your payment information is available on your account dashboard"}
payment_issue = {"How do I solve my payment issue not going through?": "Make sure the details you entered are correct!"}

/**
 * REFUND
 */

check_refund_policy = {"What cases can I be reimbursed in?": "If you cancel your order within 24 hours, you will be fully refunded"}
get_refund = {"I want to request for a refund": "Please fill out our contact us form"}
track_refund = {"How do I track my refund status?": "Through the account dashboard"}

/**
 * SHIPPING_ADDRESS
 */

change_shipping_address = {"How can I change my shipping address?": "Through your account dashboard"}
set_up_shipping_address = {"How can I set up my shipping address?": "Through your account dashboard"}


async function populateFAQ(){
    for (let article_title in create_account){
        var title = article_title;
        var content = create_account[title]

        await FAQ_ref.child("/ACCOUNT/create_account").push().set({"title": title, "content": content})
    }

    for (let article_title in delete_account){
        var title = article_title;
        var content = delete_account[title]

        await FAQ_ref.child("/ACCOUNT/delete_account").push().set({"title": title, "content": content})
    }

    for (let article_title in edit_account){
        var title = article_title;
        var content = edit_account[title]

        await FAQ_ref.child("/ACCOUNT/edit_account").push().set({"title": title, "content": content})
    }

    for (let article_title in recover_password){
        var title = article_title;
        var content = recover_password[title]

        await FAQ_ref.child("/ACCOUNT/recover_password").push().set({"title": title, "content": content})
    }

    for (let article_title in registration_problems){
        var title = article_title;
        var content = registration_problems[title]

        await FAQ_ref.child("/ACCOUNT/registration_problems").push().set({"title": title, "content": content})
    }

    for (let article_title in switch_account){
        var title = article_title;
        var content = switch_account[title]

        await FAQ_ref.child("/ACCOUNT/switch_account").push().set({"title": title, "content": content})
    }

    for (let article_title in check_cancellation_fee){
        var title = article_title;
        var content = check_cancellation_fee[title]

        await FAQ_ref.child("/CANCELLATION_FEE/check_cancellation_fee").push().set({"title": title, "content": content})
    }

    for (let article_title in contact_customer_service){
        var title = article_title;
        var content = contact_customer_service[title]

        await FAQ_ref.child("/CONTACT/contact_customer_service").push().set({"title": title, "content": content})
    }

    for (let article_title in contact_human_agent){
        var title = article_title;
        var content = contact_human_agent[title]

        await FAQ_ref.child("/CONTACT/contact_human_agent").push().set({"title": title, "content": content})
    }

    for (let article_title in delivery_options){
        var title = article_title;
        var content = delivery_options[title]

        await FAQ_ref.child("/DELIVERY/delivery_options").push().set({"title": title, "content": content})
    }

    for (let article_title in delivery_period){
        var title = article_title;
        var content = delivery_period[title]

        await FAQ_ref.child("/DELIVERY/delivery_period").push().set({"title": title, "content": content})
    }

    for (let article_title in check_invoice){
        var title = article_title;
        var content = check_invoice[title]

        await FAQ_ref.child("/INVOICE/check_invoice").push().set({"title": title, "content": content})
    }

    for (let article_title in get_invoice){
        var title = article_title;
        var content = get_invoice[title]

        await FAQ_ref.child("/INVOICE/get_invoice").push().set({"title": title, "content": content})
    }

    for (let article_title in newsletter_subscription){
        var title = article_title;
        var content = newsletter_subscription[title]

        await FAQ_ref.child("/NEWSLETTER/newsletter_subscription").push().set({"title": title, "content": content})
    }


    for (let article_title in cancel_order){
        var title = article_title;
        var content = cancel_order[title]

        await FAQ_ref.child("/ORDER/cancel_order").push().set({"title": title, "content": content})
    }
    for (let article_title in change_order){
        var title = article_title;
        var content = change_order[title]

        await FAQ_ref.child("/ORDER/change_order").push().set({"title": title, "content": content})
    }
    for (let article_title in place_order){
        var title = article_title;
        var content = place_order[title]

        await FAQ_ref.child("/ORDER/place_order").push().set({"title": title, "content": content})
    }
    for (let article_title in track_order){
        var title = article_title;
        var content = track_order[title]

        await FAQ_ref.child("/ORDER/track_order").push().set({"title": title, "content": content})
    }


    for (let article_title in check_payment_methods){
        var title = article_title;
        var content = check_payment_methods[title]

        await FAQ_ref.child("/PAYMENT/check_payment_methods").push().set({"title": title, "content": content})
    }
    for (let article_title in payment_issue){
        var title = article_title;
        var content = payment_issue[title]

        await FAQ_ref.child("/PAYMENT/payment_issue").push().set({"title": title, "content": content})
    }


    for (let article_title in check_refund_policy){
        var title = article_title;
        var content = check_refund_policy[title]

        await FAQ_ref.child("/REFUND/check_refund_policy").push().set({"title": title, "content": content})
    }
    for (let article_title in get_refund){
        var title = article_title;
        var content = get_refund[title]

        await FAQ_ref.child("/REFUND/get_refund").push().set({"title": title, "content": content})
    }
    for (let article_title in track_refund){
        var title = article_title;
        var content = track_refund[title]

        await FAQ_ref.child("/REFUND/track_refund").push().set({"title": title, "content": content})
    }



    for (let article_title in change_shipping_address){
        var title = article_title;
        var content = change_shipping_address[title]

        await FAQ_ref.child("/SHPPING_ADDRESS/change_shipping_address").push().set({"title": title, "content": content})
    }
    for (let article_title in set_up_shipping_address){
        var title = article_title;
        var content = set_up_shipping_address[title]

        await FAQ_ref.child("/SHPPING_ADDRESS/set_up_shipping_address").push().set({"title": title, "content": content})
    }
}

populateFAQ();