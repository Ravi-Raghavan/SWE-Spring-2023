function scrollRight(iter, fname, box, fix) {
  // ? number of iterations
  // * frame class name
  // * name of inner box class
  //  * fix add class name

  // var boxBlueContainer = document.getElementById("box-container");
  var boxGreenContainer, boxes, replacementBox, boxBlueContainer;
  var num = 1;

  for (let j = 1; j <= iter; j++) {
    // ? iterate over each frame
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    console.log("current box evaluated", boxBlueContainer);
    // ? checks if the current frame is visible
    if (
      window.getComputedStyle(boxBlueContainer).getPropertyValue("display") ===
      "flex"
    ) {
      // console.log("blue box is present");
      break;
    }
  }
  // gets the green box
  // * next box
  if (num === iter) {
    boxGreenContainer = document.getElementById(`${fname}1`);
    console.log("last box reached");
  } else {
    boxGreenContainer = document.getElementById(`${fname}${num + 1}`);
  }

  // gets inside blue box
  boxes = boxBlueContainer.getElementsByClassName(`${box}`);

  // gets green box
  replacementBox = boxGreenContainer.getElementsByClassName(`${box}`);

  // makes blue box shift left and disappear
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].style.opacity = "0";
    boxes[i].style.transform = "translateX(-100%)";
  }
  // scrolls the container to the left to show the next box
  boxBlueContainer.scrollLeft += boxBlueContainer.clientWidth;

  // makes green box appear from the right and shift to the center
  for (var i = 0; i < replacementBox.length; i++) {
    replacementBox[i].style.opacity = "1";
    replacementBox[i].style.setProperty("transform", "translateX(100%)");
  }

  // lists of boxes
  console.log(boxBlueContainer);
  console.log(boxGreenContainer);
  console.log("---");

  setTimeout(function () {
    // makes blue box outside box disappear
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    boxGreenContainer.style.position = "static";

    var opacity = 0;
    var step = 0.05;

    var intervalId = setInterval(function () {
      opacity += step;
      if (opacity >= 1) {
        clearInterval(intervalId);
        // for (var i = 0; i < replacementBox.length; i++) {
        //   replacementBox[i].style.transform = "translateX(0%)";
        // }
      }

      for (var i = 0; i < replacementBox.length; i++) {
        replacementBox[i].style.opacity = opacity;
        replacementBox[i].style.setProperty(
          "transform",
          "translateX(" + (opacity * 100 - 100) + "%)"
        );

        //   add a class so the css properties
        //  that were changed can be reverted
        replacementBox[i].classList.add(`${fix}`);
      }
    }, 15); // smaller interval duration for smoother animation
  }, 500);
}

function shiftLeft(iter, fname, box, fix) {
  // ? number of iterations
  // * frame class name
  //  * inner box class

  // var boxBlueContainer = document.getElementById("box-container");
  var boxGreenContainer, boxes, replacementBox, boxBlueContainer;
  var num = 1;

  for (let j = 1; j <= iter; j++) {
    // ? iterate over each frame
    boxBlueContainer = document.getElementById(`${fname}${j}`);
    num = j;
    console.log("current box evaluated", boxBlueContainer);
    // ? checks if the current frame is visible
    if (
      window.getComputedStyle(boxBlueContainer).getPropertyValue("display") ===
      "flex"
    ) {
      // console.log("blue box is present");
      break;
    }
  }
  // gets the green box
  // * next box
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

  // makes blue box shift left and disappear
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].style.opacity = "0";
    boxes[i].style.transform = "translateX(100%)";
  }

  // makes green box appear from the right and shift to the center
  for (var i = 0; i < replacementBox.length; i++) {
    replacementBox[i].style.opacity = "1";
    replacementBox[i].style.transform = "translateX(-100%)";
  }

  // lists of boxes
  console.log(boxBlueContainer);
  console.log(boxGreenContainer);
  console.log("---");

  setTimeout(function () {
    // makes blue box outside box disappear
    boxBlueContainer.style.display = "none";
    boxGreenContainer.style.display = "flex";
    // boxGreenContainer.style.position = "static";

    var opacity = 0;
    var step = 0.05;

    var intervalId = setInterval(function () {
      opacity += step;
      if (opacity >= 1) {
        clearInterval(intervalId);
        // for (var i = 0; i < replacementBox.length; i++) {
        //   replacementBox[i].style.transform = "translateX(0%)";
        // }
      }

      for (var i = 0; i < replacementBox.length; i++) {
        replacementBox[i].style.opacity = opacity;
        replacementBox[i].style.transform =
          "translateX(" + (opacity * 100 - 100) + "%)";
        replacementBox[i].classList.add(`${fix}`);
      }
    }, 15); // smaller interval duration for smoother animation
  }, 450);
}

// disable button for some time
function toggleButton(btn) {
  //  * btn stands for id of the button
  var button = document.getElementById(`${btn}`);

  // disable the button
  button.disabled = true;

  // enable the button after 1 second
  setTimeout(function () {
    button.disabled = false;
  }, 1300);
}
