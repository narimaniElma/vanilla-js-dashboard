import { getTheme } from "./theme.js";

const baseUrl = "https://js-cms.iran.liara.run/api";

const heroCardCoursesCountElem = document.querySelector("p.products-count");
const homeCoursesCountElem = document.querySelector("span.products-count");
const homeUsersCountElem = document.querySelector(".users-count");
const latestUsersContainer = document.querySelector(".latest-users .users");
const latestCoursesContainer = document.querySelector(".latest-products");

let courseLoading = true;
let userLoading = true;

const getCourses = () => {
  if (courseLoading) {
    latestCoursesContainer.innerHTML = "";

    latestCoursesContainer.insertAdjacentHTML(
      "beforeend",
      '<h4 style="text-align: center">در حال دریافت اطلاعات دوره ها</h4>',
    );
  }

  fetch(`${baseUrl}/courses`)
    .then((response) => response.json())
    .then((courses) => {
      homeCoursesCountElem.innerHTML = `<span> ${courses.length} دوره در وبسایت شما وجود دارد. </span>`;
      heroCardCoursesCountElem.innerHTML = courses.length;

      if (courses.length === 0) {
        latestCoursesContainer.innerHTML = "";

        latestCoursesContainer.insertAdjacentHTML(
          "beforeend",
          '<h4 style="text-align: center">دوره ای وجود ندارد.</h4>',
        );
      } else {
        showLatestCourses(courses);
      }
    });

  courseLoading = false;
};

const getUsers = () => {
  if (userLoading) {
  latestUsersContainer.insertAdjacentHTML(
    "beforeend",
    '<h4 style="text-align: center">در حال دریافت کاربران</h4>',
  );
  }
  
  fetch(`${baseUrl}/users`)
    .then((response) => response.json())
    .then((users) => {
      homeUsersCountElem.innerHTML = users.length;

      if (users.length === 0) {
        latestUsersContainer.innerHTML = "";

        latestUsersContainer.insertAdjacentHTML(
          "beforeend",
          '<h4 style="text-align: center">کاربری وجود ندارد.</h4>',
        );
      } else {
        showLatestUsers(users);
      }
    });

  userLoading = false;
};

function showLatestUsers(users) {
  const latestUsers = users.splice(-3);
  latestUsersContainer.innerHTML = "";

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
  latestCoursesContainer.innerHTML = "";

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
