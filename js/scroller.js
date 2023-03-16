function rightscrolling(iter, count, fname, box) {
  // ? iteration number of container
//  ? count number of boxes for each container
  // ? fname - container ID name
  //  ? box - each class name (inside container)

  var boxGreenContainer, boxes, replacementBox, boxBlueContainer;
  var num = 1;

  for (let j = 1; j <= iter; j++) {
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    
    // ? checks if the current frame is visible
    if (
      
      window.getComputedStyle(boxBlueContainer).getPropertyValue("display") ===
      "flex"
    ) {
      console.log(num);
      console.log("1st box attained");
      break;
    }
  }
  

  console.log(`${fname}${1}`);
  // gets the green box
  if (num === iter) {
    boxGreenContainer = document.getElementById(`${fname}${1}`);
    console.log("last box reached");
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num + 1}`);
    console.log("2nd box retrevied");
  }

  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

  console.log(boxes);
  console.log(replacementBox);
  console.log(boxBlueContainer);
  console.log(boxGreenContainer);

  // make blue box dissapper
  function blueDisp() {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        boxes[i].style.opacity = "0";
      }, i * 100);
    }
  }

  //  makes green appear
  function greenApr() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        replacementBox[i].style.opacity = "1";
      }, i * 170);
    }
  }
  blueDisp();
  setTimeout(greenApr, 1200);
}

// left shift
function leftscrolling(iter, count, fname, box) {
  // ? iteration number of boxes in each
  // ? count number of boxes in each container
  // ? fname - container ID name
  //  ? box - each class name (inside container)

  var boxGreenContainer, boxes, replacementBox, boxBlueContainer;
  var num = 1;

  for (let j = 1; j <= iter; j++) {
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    // ? checks if the current frame is visible
    if (
      window.getComputedStyle(boxBlueContainer).getPropertyValue("display") ===
      "flex"
    ) {
      console.log("1st box attained");
      break;
    }
  }

  // gets the green box
  if (num === 1) {
    boxGreenContainer = document.getElementById(`${fname}${iter}`);
    console.log("last box reached");
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num - 1}`);
  }


  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

   console.log(boxes);
   console.log(replacementBox);

  // make blue box dissapper
  function blueDisp() {
    for (let i = count - 1; i >= 0; i--) {
      setTimeout(() => {
        boxes[i].style.opacity = "0";
      }, (count - i) * 100 * (count - i));
    }
  }

  //  makes green appear
  function greenApr() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    for (let i = count- 1; i >= 0; i--) {
      setTimeout(() => {
        replacementBox[i].style.opacity = "1";
      }, (count - i) * 100);
    }
  }
  blueDisp();
  setTimeout(greenApr, 1200);
}
