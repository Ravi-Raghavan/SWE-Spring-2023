document.getElementById('contact-form').addEventListener('submit', function(evt){
    evt.preventDefault();
    var user_name = document.getElementById("contact-form-name").value;
    var user_email = document.getElementById("contact-form-email").value;

    var email_subject = document.getElementById("contact-form-subject").value;
    var email_content = document.getElementById("contact-form-content").value;

    var email_data = {"user_name": user_name, "user_email": user_email, "email_subject": email_subject, "email_content": email_content};

    fetch("/contact-us",{
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify(email_data)
    }).then((response)=>{
        if(response.status == 200){
            console.log("all good :)");
            alert("Email successfully Sent!");

        }else{
            console.log("not good :(");
        }
    })
})

document.querySelector(".tester").addEventListener("click",() =>{
    var sentence = "Did it work?";
    var data = {
        sentence
    };

    fetch("/testMake",{
        method: "POST",
        cache: "no-cache",
        body: JSON.stringify(data)
    }).then((response)=>{
        if(response.status == 201){
            console.log("all good :)");
        }else{
            console.log("not good :(");
        }
    })
})



