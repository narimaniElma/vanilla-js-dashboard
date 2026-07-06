import { getTheme } from "./theme.js";

const baseUrl = "https://js-cms.iran.liara.run/api";

const heroCardProductsCountElem = document.querySelector("p.products-count");
const homeProductsCountElem = document.querySelector("span.products-count");
const homeUsersCountElem = document.querySelector(".users-count");
const latestUsersContainer = document.querySelector(".latest-users");
const latestProductsContainer = document.querySelector(".latest-products");

const getCourses = () => {
  fetch(`${baseUrl}/courses`)
    .then((response) => response.json())
    .then((courses) => {
      heroCardProductsCountElem.innerHTML = courses.length;
      homeProductsCountElem.innerHTML = courses.length;

      showLatestCourses(courses);
    });
};

const getUsers = () => {
  fetch(`${baseUrl}/users`)
    .then((response) => response.json())
    .then((users) => {
      console.log(users);
      homeUsersCountElem.innerHTML = users.length;

      showLatestUsers(users);
    });
};

function showLatestUsers(users) {
  const latestUsers = users.splice(-3);

  latestUsers.forEach(function (latestUser) {
    latestUsersContainer.insertAdjacentHTML(
      "beforeend",
      `
          <article>
            <span class="icon-card">
              <i class="fa-solid fa-user"></i>
            </span>
            <div>
              <p class="user-name">${latestUser.firstname} ${latestUser.lastname}</p>
              <p class="user-email">${latestUser.email}</p>
            </div>
          </article>
      `,
    );
  });
}

function showLatestCourses(courses) {
  const latestProducts = courses.splice(-3);

  latestProducts.forEach(function (latestProduct) {
    latestProductsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
          <p class="product-title">${latestProduct.title}</p>
          <p class="product-price">${latestProduct.price.toLocaleString()}</p>
          <p class="product-registersCount">${latestProduct.registersCount}</p>
        </div>
      `,
    );
  });
}

window.addEventListener("load", () => {
  getTheme();

  getCourses();
  getUsers();
});
