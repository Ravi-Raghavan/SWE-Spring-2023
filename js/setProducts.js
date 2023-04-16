const admin = require("./firebase").admin;
var db = admin.database();

var ref = db.ref(`/Drugs/`);
var o = ref.child("/OTC/");
var p = ref.child("/Prescription/");

var json;

fetch("../json/ProductsSold.json")
  .then((response) => response.json())
  .then((data) => {
    json = data;
  })

// var json = {
//     "products": [
//         {
//             "name": "Ashwagandha",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/Ashwagandha.jpg",
//             "price": 50.99
//         },
//         {
//             "name": "Aspirin",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Aspirin.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Creatine",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/creatine.webp",
//             "price": 15.99
//         },
//         {
//             "name": "Fentanyl",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Fentanyl.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Ibuprofen",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Ibuprofen.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Ketaset",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/ketaset.png",
//             "price": 15.99
//         },
//         {
//             "name": "Losartan",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Losartan.jpeg",
//             "price": 15.99
//         },
//         {
//             "name": "Morphine",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Morphine.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Naproxen",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Naproxen.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Pantoprazole",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Pantoprazole.jpeg",
//             "price": 15.99
//         },
//         {
//             "name": "Tiger Balm",
//             "Prescription": false,
//             "limit": 20,
//             "imgPath": "../product/tigerBalm.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Whey Protein",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/WheyProtien.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Caffeine",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/Cafine.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Phosphatidic Acid",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/PhosphatidicAcid.webp",
//             "price": 15.99
//         },
//         {
//             "name": "Levothyroxine",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Levothyroxine.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Albuterol",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Albuterol.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Amlodipine",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Amlodipine.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Atorvastatin",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Atorvastatin.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Lisinopril",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Lisinopril.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Metformin",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Metformin.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Metoprolol",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Metoprolol.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Tylenol 500mg",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Tylenol500mg.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Nyquil Severe Cold & Flu",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/NyquilSevereColdFlu.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Simvastatin",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Simvastatin.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Gabapentin",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/Gabapentin.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Tramadol",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Tramadol.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Warfarin",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Warfarin.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Prednisone",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Prednisone.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Omeprazole",
//             "Prescription": true,
//             "limit": 3,
//             "imgPath": "../product/Omeprazole.webp",
//             "price": 15.99
//         },
//         {
//             "name": "VitaminC",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/VitaminC.avif",
//             "price": 15.99
//         },
//         {
//             "name": "Omega3",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/Omega3.jpg",
//             "price": 15.99
//         },
//         {
//             "name": "Calcium",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/Calcium.webp",
//             "price": 15.99
//         },
//         {
//             "name": "zinc",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/zinc.webp",
//             "price": 15.99
//         },
//         {
//             "name": "vitaminD",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/vitaminD.jpeg",
//             "price": 15.99
//         },
//         {
//             "name": "HMB",
//             "Prescription": false,
//             "limit": 3,
//             "imgPath": "../product/HMB.webp",
//             "price": 15.99
//         }
//     ]
// }

for (let i = 0; i < json.products.length; i++) {
  console.log(json.products[i]);
  if (json.products[i].Prescription) {
    p.child(json.products[i].name).set({
      name: json.products[i].name,
      stock: 100,
      limit: json.products[i].limit,
      imgPath: json.products[i].imgPath,
      price: json.products[i].price,
    });
  } else {
    o.child(json.products[i].name).set({
      name: json.products[i].name,
      stock: 100,
      limit: json.products[i].limit,
      imgPath: json.products[i].imgPath,
      price: json.products[i].price,
    });
  }
}
