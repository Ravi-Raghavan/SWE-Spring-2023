function perspectiveRight(iter, fname) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box

  var boxGreenContainer, boxBlueContainer;
  for (var j = 1; j <= iter; j++) {
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
  if (j === iter) {
    boxGreenContainer = document.getElementById(`${fname}${1}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${j + 1}`);
  }
  // move to left
  function moveToRight() {
    // * move the frame to the left
    boxBlueContainer.style.transition = " transform 1s ease, opacity 1.5s ease";
    boxBlueContainer.style.transform = "perspective(1000px) rotateY(-30deg)";
    boxBlueContainer.style.opacity = 0.3;
  }
  moveToRight();

  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.transform = "perspective(1000px) rotateY(30deg)";

    setTimeout(function () {
      boxGreenContainer.style.transition =
        "transform 1s ease, opacity 1.5s ease";
      boxGreenContainer.style.transform = "perspective(1000px) rotateY(0)";
      boxGreenContainer.style.opacity = 1;
    }, 10);
  }

  setTimeout(nextBox, 670);
}

function perspectiveLeft(iter, fname) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box

  var boxGreenContainer, boxBlueContainer;
  for (var j = 1; j <= iter; j++) {
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
  if (j === 1) {
    boxGreenContainer = document.getElementById(`${fname}${iter}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${j - 1}`);
  }
  // move to left
  function moveToRight() {
    // * move the frame to the left
    boxBlueContainer.style.transition = " transform 1s ease, opacity 0.9s ease";
    boxBlueContainer.style.transform = "perspective(1000px) rotateY(30deg)";
    boxBlueContainer.style.opacity = 0.3;
  }
  moveToRight();

  // next box to appear
  function nextBox() {
    // swtiching diplays
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.transform = "perspective(1000px) rotateY(-30deg)";

    setTimeout(function () {
      boxGreenContainer.style.transition =
        "transform 1s ease, opacity 1.2s ease";
      boxGreenContainer.style.transform = "perspective(1000px) rotateY(0)";
      boxGreenContainer.style.opacity = 1;
    }, 10);
  }

  setTimeout(nextBox, 670);
}

let dotPriority;

// chnages the dot colors
function shiftDotRight(iter, fname) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box

  var boxGreenContainer, boxBlueContainer;
  for (var j = 1; j <= iter; j++) {
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    dotPriority = j;
    // ? checks if the current frame is visible
    if (
      window.getComputedStyle(boxBlueContainer).getPropertyValue("opacity") ===
      "1"
    ) {
      break;
    }
  }
  // gets the green box
  if (j === iter) {
    boxGreenContainer = document.getElementById(`${fname}${1}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${j + 1}`);
  }
  // move to left
  function disappear() {
    // * move the frame to the left
    boxBlueContainer.style.transition = " opacity 0.7s ease";
    boxBlueContainer.style.opacity = 0.5;
  }
  disappear();

  function appear() {
    setTimeout(function () {
      boxGreenContainer.style.transition = "opacity 0.7s ease";
      boxGreenContainer.style.opacity = 1;
    }, 10);
  }

  setTimeout(appear, 700);
}

function shiftDotLeft(iter, fname) {
  //  * iter number of big boxes
  //  * ID of big box
  //  * class name of small box

  var boxGreenContainer, boxBlueContainer;
  for (var j = 1; j <= iter; j++) {
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    dotPriority = j;
    // ? checks if the current frame is visible
    if (
      window.getComputedStyle(boxBlueContainer).getPropertyValue("opacity") ===
      "1"
    ) {
      break;
    }
  }
  // gets the green box
  if (j === 1) {
    boxGreenContainer = document.getElementById(`${fname}${iter}`);
  } else {
    boxGreenContainer = document.getElementById(`${fname}${j - 1}`);
  }
  // move to left
  function disappear() {
    // * move the frame to the left
    boxBlueContainer.style.transition = " opacity 0.7s ease";
    boxBlueContainer.style.opacity = 0.5;
  }
  disappear();

  function appear() {
    setTimeout(function () {
      boxGreenContainer.style.transition = "opacity 0.7s ease";
      boxGreenContainer.style.opacity = 1;
    }, 10);
  }

  setTimeout(appear, 700);
}

// switch betwen reviews from dot
function switchReview(counter) {
  // * counter is the refernce of the box;

  if (
    (dotPriority == 1 && counter == 2) ||
    (dotPriority == 0 && counter == 1) ||
    (dotPriority == 2 && counter == 0)
  ) {
    shiftDotRight(3, "dot-box-");
    perspectiveRight(3, "review-box-");
  } else {
    shiftDotLeft(3, "dot-box-");
    perspectiveLeft(3, "review-box-");
  }
}

// * creating inifnite loop
let reviewInterval = setInterval(() => {
  perspectiveRight(3, "review-box-");
}, 4000);

let reviewDotInterval = setInterval(() => {
  shiftDotRight(3, "dot-box-");
}, 4000);

function pauseReview() {
  clearInterval(reviewInterval);
  reviewInterval = null;
  clearInterval(reviewDotInterval);
  reviewDotInterval = null;
}

function resumeReview() {
  reviewInterval = setInterval(() => {
    perspectiveRight(3, "review-box-");
    shiftDotRight(3, "dot-box-");
  }, 4000);
}
