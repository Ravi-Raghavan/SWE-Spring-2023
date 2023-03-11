// Get the dark mode preference from localStorage
const darkMode = localStorage.getItem("darkMode");

// Apply the dark mode class to the body element based on the preference
if (darkMode === "true") {
  toggleDarkMode();
}

function toggleDarkMode() {
  const body = document.body;
  document.body.classList.toggle("dark");
  const isDarkMode = body.classList.contains("dark");
  localStorage.setItem("darkMode", isDarkMode);
}
