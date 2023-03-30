/// TEST PDF CREATION


//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

// Read HTML Template
var html = fs.readFileSync("../html/orderTemplate.html", "utf8");

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;"></div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};


var orders = [
    {
     oid: "222",
     drugs: [{
        name: "Cocaine", 
        quantity: 25
     }, 
     {
        name: "Meth", 
        quantity: 25
     }],
    status: "placed",
    totalCost: 25
    }
  ];
  var document = {
    html: html,
    data: {
      orders: orders,
    },
    path: "./output.pdf",
    type: "",
  };

  pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });

