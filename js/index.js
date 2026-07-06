import { data } from "./data.js";
import { getTheme } from "./theme.js";

const heroCardProductsCountElem = document.querySelector("p.products-count");
const homeProductsCountElem = document.querySelector("span.products-count");
const homeUsersCountElem = document.querySelector(".users-count");
const latestUsersContainer = document.querySelector(".latest-users");
const latestProductsContainer = document.querySelector(".latest-products");

function getData() {
  heroCardProductsCountElem.innerHTML = data.products.length;
  homeProductsCountElem.innerHTML = data.products.length;
  homeUsersCountElem.innerHTML = data.users.length;

  showLatestUsers();
  showLatestProducts();
  getTheme();
}

function showLatestUsers() {
  const latestUsers = data.users.splice(-4, data.users.length);
  latestUsers.forEach(function (latestUser) {
    latestUsersContainer.insertAdjacentHTML(
      "beforeend",
      `
          <article>
            <span class="icon-card">
              <i class="fa-solid fa-user"></i>
            </span>
            <div>
              <p class="user-name">${latestUser.name}</p>
              <p class="user-email">${latestUser.email}</p>
            </div>
          </article>
      `,
    );
  });
}

function showLatestProducts() {
  const latestProducts = data.products.splice(-4, data.products.length);

  latestProducts.forEach(function (latestProduct) {
    latestProductsContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
          <p class="product-title">${latestProduct.title}</p>
          <p class="product-price">${latestProduct.price.toLocaleString()}</p>
          <p class="product-shortName">${latestProduct.slug}</p>
        </div>
      `,
    );
  });
}

document.addEventListener("DOMContentLoaded", getData);
