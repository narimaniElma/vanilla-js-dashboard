import { getTheme } from "./theme.js";

const baseUrl = "https://js-cms.iran.liara.run/api";

const heroCardCoursesCountElem = document.querySelector("p.products-count");
const homeCoursesCountElem = document.querySelector("span.products-count");
const homeUsersCountElem = document.querySelector(".users-count");
const latestUsersContainer = document.querySelector(".latest-users");
const latestCoursesContainer = document.querySelector(".latest-products");

const getCourses = () => {
  fetch(`${baseUrl}/courses`)
    .then((response) => response.json())
    .then((courses) => {
      heroCardCoursesCountElem.innerHTML = courses.length;
      homeCoursesCountElem.innerHTML = courses.length;

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
  const latestCourses = courses.splice(-3);

  latestCourses.forEach(function (latestCourse) {
    latestCoursesContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
          <p class="product-title">${latestCourse.title}</p>
          <p class="product-price">${latestCourse.price.toLocaleString()}</p>
          <p class="product-registersCount">${latestCourse.registersCount}</p>
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
