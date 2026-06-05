const themeButton = document.querySelector(".theme-button");
const htmlTags = document.querySelectorAll("html");

let theme = "light";

function changeTheme() {
  htmlTags.forEach(function (htmlTag) {
    htmlTag.classList.toggle("dark");
  });

  if (theme === "light") {
    themeButton.innerHTML = '<i class="fas fa-moon"></i>';
    theme = "dark";
  } else {
    themeButton.innerHTML = '<i class="fas fa-sun"></i>';
    theme = "light";
  }

  setThemeInLocalStorage();
}

export function getTheme() {
  const localTheme = localStorage.getItem("theme");

  if (localTheme) {
    theme = localTheme;
  } else {
    setThemeInLocalStorage();
  }
}

function setThemeInLocalStorage() {
  localStorage.setItem("theme", theme);
}

themeButton?.addEventListener("click", changeTheme);
