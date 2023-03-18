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
  if (num === iter) {
    boxGreenContainer = document.getElementById(`${fname}${1}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num + 1}`);
  }

  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

  // move to left
  function moveToLeft() {
    boxBlueContainer.style.transition = "transform 2.5s ease-in"; // Set the transition duration to 2 seconds
    boxBlueContainer.style.transform = `translateX(-${transformLen}%)`;
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].style.transition = "opacity 0.5s ease";
      boxes[i].style.opacity = "0";
    }
  }

  moveToLeft();
  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.flexDirection = "column";
    boxGreenContainer.style.transform = "translateX(80%)";

    // ensures that the next box is visible
    if (
      boxBlueContainer.style.display === "none" &&
      boxGreenContainer.style.display === "flex" &&
      boxGreenContainer.style.transform === "translateX(80%)"
    ) {
      setTimeout(function () {
        boxGreenContainer.style.transition = "transform 2s ease-out"; // Set the transition duration to 2 seconds
        boxGreenContainer.style.transform = "translateX(0)";
        for (var i = 0; i < replacementBox.length; i++) {
          replacementBox[i].style.transition = "opacity 2s ease";
          replacementBox[i].style.opacity = "1";
        }
      }, 10);
    }
  }

  setTimeout(nextBox, 400);
}

// ? homepage title shuffle
setInterval(() => {
  move(5, "title-container-", "title-box", 100);
}, 5000);

// ? homepage item shuffle
// ? scrolls right and opacity changes linearly
function diagScrollRight(iter, fname, box, transformLen) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box
  //   ? transformLen defines how much transformation of the left box
  var boxGreenContainer, boxes, replacementBox, boxBlueContainer;
  var num = 1;
  var nterm = (iter * (iter - 1)) / 2;
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

  // move to left
  function moveToRight() {
    // * move the frame to the left
    boxBlueContainer.style.transition = "transform 2s ease";
    boxBlueContainer.style.transform = `translateX(${transformLen}%)`;

    //  * disappear the inner box
    for (let i = boxes.length - 1; i >= 0; i--) {
      setTimeout(() => {
        boxes[i].style.transition = "opacity 0.5s ease";
        boxes[i].style.opacity = "0";
      }, (box.length - 1 - i) * 50); // ! time taken is 0s 100s 200s
    }
  }
  moveToRight();

  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.transform = `translateX(-${transformLen}%)`;

    setTimeout(function () {
      // * green shifts to center
      boxGreenContainer.style.transition = "transform 1.2s ease-out"; // Set the transition duration to 2 seconds
      boxGreenContainer.style.transform = "translateX(0)";

      // * next inner box reappear
      //  * disappear the inner box
      for (let i = 0; i < replacementBox.length; i++) {
        setTimeout(() => {
          replacementBox[i].style.transition =
            "opacity 0.5s ease, transform 0.5s ease-out";
          replacementBox[i].style.opacity = 1;
        }, i * 50);
      }
    }, 10);
  }

  setTimeout(nextBox, 530);
}

// ? scroll left and opacity chnages linearly
function diagScrollLeft(iter, fname, box, transformLen) {
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
  // gets the green box
  if (num === 1) {
    boxGreenContainer = document.getElementById(`${fname}${iter}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num - 1}`);
  }
  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);
  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);
  // move to left
  function moveToLeft() {
    // * move the frame to the left
    boxBlueContainer.style.transition = "transform 2s ease";
    boxBlueContainer.style.transform = `translateX(-${transformLen}%)`;
    //  * disappear the inner box
    for (let i = 0; i < boxes.length; i++) {
      setTimeout(() => {
        boxes[i].style.transition = "opacity 0.5s ease";
        boxes[i].style.opacity = "0";
      }, i * 50);
    }
  }
  moveToLeft();
  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.transform = `translateX(${transformLen}%)`;
    // ensures that the next box is visible

    setTimeout(function () {
      // * green shifts to center
      boxGreenContainer.style.transition = "transform 1.2s ease-out"; // Set the transition duration to 2 seconds
      boxGreenContainer.style.transform = "translateX(0)";
      // * next inner box reappear
      //  * disappear the inner box
      for (let i = 0; i < replacementBox.length; i++) {
        setTimeout(() => {
          replacementBox[i].style.transition =
            "opacity 0.5s ease, , transform 0.5s ease-out";
          replacementBox[i].style.opacity = 1;
        }, (replacementBox.length - 1 - i) * 50);
      }
    }, 10);
  }

  setTimeout(nextBox, 530);
}
