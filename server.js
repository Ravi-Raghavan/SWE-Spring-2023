//Import Libraries to start up Node.js Server
const http = require("http");
const url = require("url");
const fs = require("fs");
const nodemailer = require('nodemailer');


const server = http.createServer((request, response) => {
    //Handle client requests and issue server response here 
})


server.listen(8000, "localhost", () => {
    console.log("Spun up Node.js server running locally on port 8000")
})

