function rightscrolling(iter, fname, box) {
  // ? iteration number of boxes in each
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
  if (num === iter) {
    boxGreenContainer = document.getElementById(`${fname}1`);
    console.log("last box reached");
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num + 1}`);
    console.log("2nd box retrevied");
  }

  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

  // make blue box dissapper
  function blueDisp() {
    for (let i = 0; i < iter; i++) {
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
    for (let i = 0; i < iter; i++) {
      setTimeout(() => {
        replacementBox[i].style.opacity = "1";
      }, i * 170);
    }
  }
  blueDisp();
  setTimeout(greenApr, 1200);
}

// left shift
function leftscrolling(iter, fname, box) {
  // ? iteration number of boxes in each
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

  // make blue box dissapper
  function blueDisp() {
    for (let i = iter - 1; i >= 0; i--) {
      setTimeout(() => {
        boxes[i].style.opacity = "0";
      }, (iter - i) * 100);
    }
  }

  //  makes green appear
  function greenApr() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    for (let i = iter - 1; i >= 0; i--) {
      setTimeout(() => {
        replacementBox[i].style.opacity = "1";
      }, (iter - i) * 100);
    }
  }
  blueDisp();
  setTimeout(greenApr, 1200);
}
