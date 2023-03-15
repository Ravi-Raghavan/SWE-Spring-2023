// loads stylesheet first
const linkheader = document.createElement("link");
linkheader.rel = "stylesheet";
linkheader.href = "../css/homepage-nav.css";
document.head.appendChild(linkheader);

const linkfooter = document.createElement("link");
linkfooter.rel = "stylesheet";
linkfooter.href = "../css/homepage-footer.css";
document.head.appendChild(linkfooter);

// Load header content
fetch("/html/header.html")
  .then((response) => response.text())
  .then((data) => {
    // console.log(data);
    document.getElementById("header").innerHTML = data;
  });

//  Load footer content
fetch("/html/footer.html")
  .then((response) => response.text())
  .then((data) => {
    // console.log(data);
    document.getElementById("footer").innerHTML = data;
  });

