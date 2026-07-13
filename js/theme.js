const themeButton = document.querySelector(".theme-button");
const htmlTags = document.querySelectorAll("html");

let theme = "light";

function changeTheme() {
  if (theme === "light") {
    theme = "dark";

    themeButton.innerHTML = '<i class="fas fa-moon"></i>';

    htmlTags.forEach(function (htmlTag) {
      htmlTag.classList.add("dark");
    });
  } else {
    theme = "light";

    themeButton.innerHTML = '<i class="fas fa-sun"></i>';

    htmlTags.forEach(function (htmlTag) {
      htmlTag.classList.remove("dark");
    });
  }

  setThemeInLocalStorage();
}

function getTheme() {
  const localTheme = localStorage.getItem("theme");

  if (localTheme) {
    theme = localTheme;
  } else {
    setThemeInLocalStorage();
  }

  if (theme === "light") {
    themeButton.innerHTML = '<i class="fas fa-moon"></i>';

    htmlTags.forEach(function (htmlTag) {
      htmlTag.classList.remove("dark");
    });
  } else {
    themeButton.innerHTML = '<i class="fas fa-sun"></i>';

    htmlTags.forEach(function (htmlTag) {
      htmlTag.classList.add("dark");
    });
  }
}

function setThemeInLocalStorage() {
  localStorage.setItem("theme", theme);
}

window.addEventListener("load", getTheme);
themeButton?.addEventListener("click", changeTheme);
