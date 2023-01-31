// File to test out CryptoJS AES-based encryption for storing user's sensitive data in the application
var CryptoJS = require("crypto-js");

// Encrypt
var key = "random_key";
var ciphertext = CryptoJS.AES.encrypt('my message', key).toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText); // 'random_password'


var jsonObj = {id: 12};

var jsonString = JSON.stringify(jsonObj);


// Encrypt
var key = "random_key";
var ciphertext = CryptoJS.AES.encrypt(jsonString, key).toString();

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(JSON.parse(originalText)); // 'random_password'
