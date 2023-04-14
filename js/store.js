// import { initializeApp } from "firebase-admin/app";
// import { getDatabase } from "firebase-admin/database";


/* TO DO
    1. Get the list of prescribed medication names for the specific user once the page loads
    2. Using that list, get each medication, from the database at address drugs/prescription/...
    3. Additionally, on load, add all the over the counter medication to the database: For loop get request from database at address drugs/OTC/...
    4. (Qadis) after payment has been verified, send email to user email confirming payment.

    Front-End:
    1. Swap buttons:
        a) addToCartClicked: when user clicks add to cart, button must be swapped
        b) removeItem: when user removes item from cart, shop item must also change back.
        but if removing from the shop items, then must only remove the cart value associated with that medication.
*/

if (localStorage.getItem("User Record") == null) {
        alert("You must login to access the cart page");

        window.location.href = "http://localhost:8000/html/homepage.html";
    }

if (document.readyState == 'loading') {
    //wait for webpage to be loaded
    document.addEventListener('DOMContentLoaded', ready)
}
else {
    //webpage is loaded

    ready()

}

async function ready() {

    // var user_record = JSON.parse(localStorage.getItem("User Record"));
    // var uid = user_record["uid"];

    // let res = await fetch(`/get/prescriptions/user?uid=${user_record["uid"]}`, {
    //         method: 'GET'
    //     })

    //     let responseStatus = res.status;
    //     let prescriptions = await res.json()
    //     console.log("This is what is prescriptions:"+ JSON.stringify(prescriptions));
    //     //document.getElementById("dropbtn").src = profilePicture;
    //     //console.log(profilePicture);
    //     //document.getElementById("dropbtn").style.filter = "none";
    //     //document.getElementById("dropbtn").style.backgroundColor = "#8fc0e3";
    //     var counter = 0;
    //     if (responseStatus == 200){
    //         for (var prescriptionNumber in prescriptions){
    //             console.log("ran");
    //             counter++;
    //         }
    //     }
    //     if(counter == 0){
    //         document.getElementById("prescriptionMedication").remove();
    //     }





    //upload customer's data convert from JSON into html and add to the cart using addItemToCart(title, price, imageSrc, drugQuantity)

    function resetRemoveListener() {
        var removeCartItemButtons = document.getElementsByClassName('btn-danger')

        for (var i = 0; i < removeCartItemButtons.length; i++) {
            var button = removeCartItemButtons[i]
            button.addEventListener('click', removeCartItem)
        }
    }

    resetRemoveListener();

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    function resetShopButton() {
        var addToCartButtons = document.getElementsByClassName('shop-item-button')
            for (var i = 0; i < addToCartButtons.length; i++) {
                var button = addToCartButtons[i]
                button.addEventListener('click', addToCartClicked);
                button.addEventListener('click', swapbutton);
        }
    }

    resetShopButton();

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

    var user_record = JSON.parse(localStorage.getItem("User Record"));
    var uid = user_record.uid;

    let response = await fetch(`/get/cart?uid=${uid}`, {method: "GET"})
    let cartJSON = await response.json();

    let drugs = cartJSON["drugs"]
    //alert(JSON.stringify(drugs));
    for (var i = 0; i < drugs.length; i ++){
        var drug = drugs[i];
        var drugPrice = drug["price"]
        var drugQuantity = drug["quantity"]
        var drugTitle = drug["title"]
        var image = drug['imageSrc']

        //"../images/Ibuprofen.jpg"

        addItemToCart(drugTitle, drugPrice, image , drugQuantity);
    }

    let cartItems = document.getElementsByClassName("cart-item-title");
    let shopItems = document.getElementsByClassName("shop-item-title");
    if (cartItems.length > 0) {
        for (let i = 0; i < cartItems.length; i++) {
            for (let j = 0; j < shopItems.length; j++) {
                if (cartItems[i].innerText == shopItems[j].innerText) {
                    let button = shopItems[j].parentElement.getElementsByClassName("btn btn-primary shop-item-button")[0];
                    if (button.innerText == "Add to Cart") {
                        button.innerText = "\u2715 Remove";
                        button.setAttribute("class", "btn btn-danger");
                    }
                }
            }
        }
    }

    updateCartTotal();
}

function purchaseClicked() {
    // alert('Thank you for your purchase')                                // Insert HTTP request here to transfer to payment page.
    // Each time an order is changed the product is added to User/Orders/ in Firebase

    // var cartItems = document.getElementsByClassName('cart-items')[0]
    // while (cartItems.hasChildNodes()) {
    //     cartItems.removeChild(cartItems.firstChild)
    // }
    if (total != 0) {
        document.getElementById("paypal-button-container").style.display = "block";
    } else {
        alert("Please add items to cart first")
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove()

    var title = buttonClicked.parentElement.parentElement
        // .getElementsByClassName("cart-item cart-column")[0]
        .getElementsByClassName("cart-item-title")[0]
        .innerText;                                                         // get the title of the item
    console.log(title);
    var shopItems = document.getElementsByClassName("shop-item");           // get all the shop items. Go through each one get the item and if
    for (var i = 0; i < shopItems.length; i++) {                            // the removed item is the same as the shop item
        var item = document.getElementsByClassName("shop-item-title")[i];
        var shopItemName = item.innerText;
        console.log(i+" "+shopItemName);
        if (shopItemName == title) {
            let button = item.parentElement
                // .getElementsByClassName("shop-item-details")[0]
                .getElementsByClassName("btn-danger")[0];
            button.innerText = "Add to Cart";
            button.setAttribute("class", "btn btn-primary shop-item-button");
        }
    }
    // console.log("clicked")
    // swaps(event);
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function swaps(event, title) {
    var button = event.target;
    if (button.innerText == "Add to Cart") {
        button.innerText = "\u2715 Remove";
        button.setAttribute("class", "btn btn-danger");
        resetRemoveListener();
    } else {
        button.innerText = "Add to Cart";
        button.setAttribute("class", "btn btn-primary shop-item-button");
    }

    resetRemoveListener();
    resetShopButton();

}

function swapbutton(event, title) {
    var button = event.target;
    if (button.innerText == "Add to Cart") {
        button.innerText = "\u2715 Remove";
        button.setAttribute("class", "btn btn-danger");
    } else {
        button.innerText = "Add to Cart";
        button.setAttribute("class", "btn btn-primary shop-item-button");

        // var func = button.getAttribute("onclick");
        // title = func.match(/'[a-zA-Z]*\s?\d*[a-zA-Z]*'/)[0];
        // title = title.replace(/'/g, '');

        var cartItemNames = document.getElementsByClassName('cart-item-title');
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText == title) {
                cartItemNames[i].parentElement.parentElement.remove();
                updateCartTotal();
            }
        }
    }

}

function addToCartClicked(event, itemImg, itemPrice, itemTitle) {
    var button = event.target;

    // var theme = document.getElementsByTagName("body")[0];
    // if (theme.classList.contains('dark')) {
    //     button.style.outline = "2px solid var(--primary)";

    //     setTimeout(function () {
    //         button.style.outline = "transparent";
    //     }, 1000);
    // } else {
    //     button.style.outline = "2px solid var(--primary)";

    //     setTimeout(function () {
    //         button.style.outline = "transparent";
    //     }, 1000);
    // }

    var shopItem = button.parentElement.parentElement;
    //var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var title = itemTitle;
    //console.log(shopItem);
    var price = shopItem.getElementsByClassName(itemPrice)[0].innerText;            //error reading inner text

    var priceVal = parseFloat(
        shopItem
        .getElementsByClassName(itemPrice)[0]
        .innerText.replace("$", "")
    );

    // var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var imageSrc = shopItem.getElementsByClassName(itemImg)[0].src;
    console.log(title, price);
    //Add item to order JSON.
    // order.push({ "item-name": title, price: priceVal, quantity: 1 });
    // console.log(order);

    addItemToCart(title, price, imageSrc, 1);
    //swaps(event);
    updateCartTotal();

    //This fetch will request the uri path to update the cost of the cart and add drugs
    //we can update quantity too if we add a variable to this javascript file that updates quantity aswell.
    // fetch('http://localhost:8000/api/updateCart', {
    //         method : 'PATCH',
    //         body : JSON.stringify({
    //             costs : total,
    //             quantity : 1,
    //             drugs : title
    //         }),
    //         headers: {
    //             'Content-type': 'application/json',
    //     },
    // })
    // .then((response) => response.json())
    // .then((json) => console.log(json));

    // order.push({"costs" : total+priceVal, "drugs" : title , "quantity" : 1})
    // console.log(order)
}

function addItemToCart(title, price, imageSrc, drugQuantity) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            //alert('This item is already added to the cart')
            return
        }
    }

    var cartRowContents = `
<div class="cart-item cart-column">
    <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
    <span class="cart-item-title">${title}</span>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="${drugQuantity}">
    <button class="btn btn-danger" type="button">REMOVE</button>
</div>`

    cartRow.innerHTML = cartRowContents

    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}


var total = 0;
var totalquantity = 0;


function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    total = 0
    totalquantity = 0
    var drugData = []

    for (var i = 0; i < cartRows.length; i++) {
        var drugInformation = {}
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item')[0].innerText;
        var imgSrc = cartRow.getElementsByClassName('cart-item-image')[0].src;
        //console.log("[][][] The image Source is :" +imgSrc)
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
        totalquantity = parseFloat(totalquantity) + parseFloat(quantity)

        drugInformation["title"] = title;
        drugInformation["quantity"] = quantity;
        drugInformation["price"] = price;
        drugInformation["imageSrc"] = imgSrc;

        drugData.push(drugInformation);
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total

    console.log("UID: " + JSON.parse(window.localStorage.getItem("User Record")).uid);
    console.log("Drug Data: " + drugData);

    fetch('http://localhost:8000/api/updateCart', {
        method : 'PATCH',
        body : JSON.stringify({
            cartTotal : total,
            drugs: drugData,
            uid: JSON.parse(window.localStorage.getItem("User Record")).uid
        }),
        headers: {
            'Content-type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log("Success:", json))
        .catch((error) => console.error("Error: ", error));

}

// window.onload = async function (){
//     if (localStorage.getItem("User Record") == null) {

//     } else {

//         var user_record = JSON.parse(localStorage.getItem("User Record"));
//         var uid = user_record["uid"];
//         var profilePicture = user_record.photoURL;

//         let response = await fetch(`/get/prescriptions/user?uid=${user_record["uid"]}`, {
//             method: 'GET'
//         })

//         let responseStatus = response.status;
//         let prescriptions = await response.json()
//         console.log("This is what is prescriptions:"+ JSON.stringify(prescriptions));
//         document.getElementById("dropbtn").src = profilePicture;
//         console.log(profilePicture);
//         document.getElementById("dropbtn").style.filter = "none";
//         document.getElementById("dropbtn").style.backgroundColor = "#8fc0e3";
//         var counter = 0;
//         if (responseStatus == 200){
//             for (var prescriptionNumber in prescriptions){
//                 console.log("ran");
//                 counter++;
//             }
//         }
//         if(counter == 0){
//             document.getElementById("prescriptionMedication").remove();
//         }
//     }
// }
