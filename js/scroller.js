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
      }, i * 70);
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
      }, i * 70);
    }
  }
  blueDisp();
  setTimeout(greenApr, 590);
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
      }, (count - 1 - i) * 70);
    }
  }

  //  makes green appear
  function greenApr() {
    // switch display
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";

    for (let i = count - 1; i >= 0; i--) {
      setTimeout(() => {
        replacementBox[i].style.opacity = "1";
      }, (count - i) * 70);
    }
  }
  blueDisp();
  // setTimeout(switchDisp, 1200);
  setTimeout(greenApr, 590);
}

// TODO simple left scroller
function move(iter, fname, box, transformLen) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box
  //   ? transformLen defines how much transformation of the left box

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
      break;
    }
  }

  // console.log(boxBlueContainer);
  // gets the green box
  if (num === iter) {
    boxGreenContainer = document.getElementById(`${fname}${1}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num + 1}`);
  }

  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

  // console.log(boxGreenContainer);

  // move to left
  function moveToLeft() {
    boxBlueContainer.style.transition = "transform 2.5s ease-in"; // Set the transition duration to 2 seconds
    boxBlueContainer.style.transform = `translateX(-${transformLen}%)`;
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].style.transition = "opacity 0.5s ease";
      boxes[i].style.opacity = "0";
    }
    // boxes[0].style.transition = "opacity 0.5s ease";
    // boxes[0].style.opacity = "0";
  }

  moveToLeft();

  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.flexDirection = "column";
    boxGreenContainer.style.transform = "translateX(60%)";

    // ensures that the next box is visible
    if (
      boxBlueContainer.style.display === "none" &&
      boxGreenContainer.style.display === "flex" &&
      boxGreenContainer.style.transform === "translateX(60%)"
    ) {
      setTimeout(function () {
        boxGreenContainer.style.transition = "transform 2s ease-out"; // Set the transition duration to 2 seconds
        boxGreenContainer.style.transform = "translateX(0)";
        for (var i = 0; i < replacementBox.length; i++) {
          replacementBox[i].style.transition = "opacity 2s ease";
          replacementBox[i].style.opacity = "1";
        }

      //   replacementBox[0].style.transition = "opacity 2s ease";
      //   replacementBox[0].style.opacity = 1;
      }, 10);
    }
  }

  setTimeout(nextBox, 400);
}

// ? homepage title shuffle
setInterval(() => {
  move(5, "title-container-", "title-box", 100);
}, 5000);
