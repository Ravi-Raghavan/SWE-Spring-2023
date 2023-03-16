let images = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  // add more image URLs here
];

let imageObjects = [];

function preloadImages() {
  for (let i = 0; i < images.length; i++) {
    let img = new Image();
    img.src = images[i];
    imageObjects.push(img);
  }
}

// Call the preloadImages function to start preloading the images
preloadImages();
