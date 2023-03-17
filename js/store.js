var order = [

    {
        "item-name" : "tylenol",
        "price" : 10.99,
        "quantity" : 2
    },
    {
        "item-name" : "ibuprophen",
        "price" : 11.99,
        "quantity" : 1
    }

]

if(document.readyState == 'loading') {
    //wait for webpage to be loaded
    document.addEventListener('DOMContentLoaded', ready)
}
else
{
    //webpage is loaded
    ready()
}

function ready() {

var removeCartItemButtons = document.getElementsByClassName('btn-danger')
console.log(removeCartItemButtons)

var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
updateCartTotal()

//upload customer's data convert from JSON into html and add to the cart using addItemToCart(title, price, imageSrc)


for (var i = 0; i <removeCartItemButtons.length; i++)
{
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)

}
var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    // alert('Thank you for your purchase')                                // Insert HTTP request here to transfer to payment page.
                                                                        // Each time an order is changed the product is added to User/Orders/ in Firebase

    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
    }

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove()
    console.log("clicked")
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var priceVal = parseFloat(shopItem.getElementsByClassName('shop-item-price')[0].innerText.replace('$',''))

    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    console.log(title, price)
    //Add item to order JSON.

    addItemToCart(title, price,imageSrc)
    updateCartTotal()
    
    //This fetch will request the uri path to update the cost of the cart and add drugs
    //we can update quantity too if we add a variable to this javascript file that updates quantity aswell.
    fetch('http://localhost:8000/api/updateCart', {
            method : 'PATCH',
            body : JSON.stringify({
                costs : total,
                quantity : 1,
                drugs : title
            }),
            headers: {
                'Content-type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((json) => console.log(json));

    // order.push({"costs" : total+priceVal, "drugs" : title , "quantity" : 1})
    // console.log(order)
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')

    for (var i = 0; i < cartItemNames.length; i++)
    {
        if(cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
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
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">REMOVE</button>
</div>`

cartRow.innerHTML = cartRowContents

    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}


function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')
        [0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}
