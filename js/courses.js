import { getTheme } from "./theme.js";
import { setCache, getCache } from "../helpers/cashe.js";

const url = "https://js-cms.iran.liara.run/api/courses";

const coursesTable = document.querySelector(".products");
const createCourseBtn = document.querySelector("#create-product");
const modalCourseScreen = document.querySelector(".modal-product-screen");
const modalCourseContainer = document.querySelector(".modal-product");
const coursesCountElem = document.querySelector(".products-data");
const paginationElem = document.querySelector(".pagination-products");
const toastElem = document.querySelector(".product-toast");
const toastProcessElem = document.querySelector(".process-product");
const toastContentElem = document.querySelector(".toast-content-product");

let mainCourse;

const coursePerPage = 4;
let courses = [];
let courseIdToRemove;
let courseIdToUpdate;
let coursesStartIndex = 0;
let coursesEndIndex = coursePerPage;
let isLoading = true;

const fetchData = () => {
  if (isLoading) {
    coursesTable.innerHTML = "";

    coursesTable.insertAdjacentHTML(
      "beforeend",
      '<h4 style="text-align: center;">در حال دریافت اطلاعات</h4>',
    );
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      courses = data;
      coursesCountElem.innerHTML = courses.length;

      if (courses.length === 0) {
        coursesTable.innerHTML = "";

        coursesTable.insertAdjacentHTML(
          "beforeend",
          '<h4 style="text-align: center">دوره ای وجود ندارد.</h4>',
        );
      } else {
        showCourses();
      }

      setCache("courses", courses);
      generatePagination();
    });

  isLoading = false;
};

function showCourses() {
  coursesTable.innerHTML = "";

  const coursesSlic = courses.slice(coursesStartIndex, coursesEndIndex);

  coursesSlic.forEach(function (course) {
    coursesTable.insertAdjacentHTML(
      "beforeend",
      `
          <div class="tableRow">
            <p class="product-title">${course.title}</p>
            <p class="product-price">${course.price.toLocaleString()}</p>
            <p class="product-registersCount">${course.registersCount}</p>
            <div class="product-manage">
              <button class="edit-btn" data-id="${course._id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" data-id="${course._id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
    );
  });

  coursesTable.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    const removeBtn = e.target.closest(".remove-btn");

    if (editBtn) {
      showEditCourseModal(editBtn.dataset.id);
    }

    if (removeBtn) {
      showRemoveCourseModal(removeBtn.dataset.id);
    }
  });
}

window.addEventListener("load", fetchData);

function getCourses() {
  const cashe = getCache("courses", 5 * 60 * 1000);

  if (cashe) {
    courses = cashe.data;
    showCourses();
  } else {
    fetchData();
  }

  getTheme();

  if (courses) {
    coursesCountElem.innerHTML = courses.length;
  }
}

function generatePagination(activePageBox = 1) {
  paginationElem.innerHTML = "";

  if (courses) {
    let coursePagesCount = Math.ceil(courses.length / coursePerPage);

    for (let i = 0; i < coursePagesCount; i++) {
      const pageNumber = i + 1;
      if (courses.length < coursePerPage) return;

      paginationElem.insertAdjacentHTML(
        "beforeend",
        `
            <span tabindex=${pageNumber} data-id='${pageNumber}' class="page ${pageNumber == activePageBox ? "active" : ""}" >${pageNumber}</span>
          `,
      );
    }
  }

  const pageBoxes = paginationElem.querySelectorAll(".page");

  pageBoxes.forEach((pageBox) => {
    pageBox.addEventListener("click", (event) => {
      const currentCoursePage = event.target.dataset.id;

      pageBoxes.forEach((item) => {
        item.classList.remove("active");
      });

      event.target.classList.add("active");
      changePageHandler(currentCoursePage);
    });
  });
}

function changePageHandler(selectedPage) {
  coursesStartIndex = (selectedPage - 1) * coursePerPage;
  coursesEndIndex = coursesStartIndex + coursePerPage;

  showCourses();
}

function showCreateCourseModal() {
  modalCourseScreen.classList.remove("hidden");

  createCourseModal();
}

function createCourseModal() {
  modalCourseContainer.innerHTML = "";

  modalCourseContainer.insertAdjacentHTML(
    "beforeend",
    `
          <header class="modal-header">
            <h3>ایجاد دوره</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              required
              type="text"
              class="modal-input"
              min='3'
              placeholder="عنوان دوره را وارد نمائید ..."
              id="product-title"
            />
            <input
              required
              type="number"
              class="modal-input"
              placeholder="قیمت دوره را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="number"
              class="modal-input"
              placeholder="تعداد دانشجوهای دوره را وارد نمائید ..."
              id="product-registersCount"
            />
             <p class='error'>
            </p>
          </main>
          <footer class="modal-footer">           
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `,
  );

  modalCourseContainer
    .querySelector(".submit")
    .addEventListener("click", createNewCourse);

  hideModal();
}

function hideModal() {
  const closeModalIcon = modalCourseContainer.querySelector(".close-modal");
  const closeModalBtn = modalCourseContainer.querySelector(".cancel");

  closeModalIcon.addEventListener("click", function () {
    modalCourseScreen.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", function () {
    modalCourseScreen.classList.add("hidden");
  });
}

function createNewCourse() {
  const title = document.querySelector("#product-title").value;
  const price = document.querySelector("#product-price").value;
  const registersCount = document.querySelector(
    "#product-registersCount",
  ).value;

  const isValid = handleValidation(title, price);

  if (!isValid) return;

  const newCourse = {
    title,
    price: +price,
    registersCount,
    category: "فرانت اند",
    discount: 0,
    desc: "توضیحات ندارد",
  };

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newCourse),
  }).then((response) => {
    if (response.status === 201) {
      modalCourseScreen.classList.add("hidden");
      fetchData();
      showToast("create", "دوره با موفقیت ایجاد شد.");
    }
  });
}

const handleValidation = (title, price) => {
  const errorElem = document.querySelector(".error");
  const errors = [];

  if (title.length < 3) {
    errors.push("عنوان دوره باید حداقل 3 کاراکتر باشد.");
  }

  if (
    courses &&
    courses.find(function (course) {
      return course.title === title && mainCourse._id !== course._id;
    })
  ) {
    errors.push("دوره با این عنوان قبلاً ثبت شده است.");
  }

  if (!price) {
    errors.push("قیمت تعیین نشده است.");
  }

  if (errors.length) {
    errorElem.innerHTML = errors.join("<br/>");
    return false;
  }

  return true;
};

function showToast(status, message) {
  toastElem.classList.remove("hidden");
  toastContentElem.innerHTML = message;
  let step = 1;

  if (status === "delete") {
    toastElem.className = "toast product-toast failed";
  }

  if (status === "edit") {
    toastElem.className = "toast product-toast success";
  }

  if (status === "create") {
    toastElem.className = "toast product-toast success";
  }

  const toastInterval = setInterval(() => {
    step++;

    if (step > 110) {
      clearInterval(toastInterval);
      step = 1;
      toastElem.classList.add("hidden");
    }

    toastProcessElem.style.width = `${step}%`;
  }, 50);
}

function removeCourseModal() {
  modalCourseContainer.innerHTML = "";

  modalCourseContainer.insertAdjacentHTML(
    "beforeend",
    `         
          <i class="ui-border top red"></i>
          <i class="ui-border bottom red"></i>
          <header class="modal-header">
            <h3>حذف دوره</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <p class="remove-text">آیا از حذف این دوره اطمینان دارید؟</p>
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `,
  );

  modalCourseContainer
    .querySelector(".submit")
    .addEventListener("click", removeCourse);

  hideModal();
}

function showRemoveCourseModal(courseId) {
  courseIdToRemove = courseId;
  removeCourseModal();
  modalCourseScreen.classList.remove("hidden");
}

function removeCourse() {
  fetch(`${url}/${courseIdToRemove}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status === 200) {
      fetchData();
      modalCourseScreen.classList.add("hidden");
      showToast("delete", "دوره با موفقیت حذف شد.");
    }
  });
}

function showEditCourseModal(courseId) {
  courseIdToUpdate = courseId;

  mainCourse = courses.find(function (course) {
    return course._id === courseId;
  });

  editCourseModal(mainCourse);

  modalCourseScreen.classList.remove("hidden");
}

function editCourseModal(course) {
  modalCourseContainer.innerHTML = "";

  modalCourseContainer.insertAdjacentHTML(
    "beforeend",
    `         
         <header class="modal-header">
            <h3>ویرایش دوره</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              required
              type="text"
              value='${course.title}'
              class="modal-input"
              placeholder="عنوان دوره را وارد نمائید ..."
              id="product-title"
            />
            <input
              required
              type="number"
              value='${course.price}'
              class="modal-input"
              placeholder="قیمت دوره را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              value='${course.registersCount}'
              class="modal-input"
              placeholder="تعداد دانشجو دوره را وارد نمائید ..."
              id="product-registersCount"
            />
             <p class='error'>
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `,
  );

  modalCourseContainer
    .querySelector(".submit")
    .addEventListener("click", editCourse);

  hideModal();
}

function editCourse() {
  const title = document.querySelector("#product-title").value;
  const price = document.querySelector("#product-price").value;
  const registersCount = document.querySelector(
    "#product-registersCount",
  ).value;

  const isValid = handleValidation(title, price);

  if (!isValid) return;

  // mainCourse.title = title;
  // mainCourse.price = +price;
  // mainCourse.registersCount = registersCount;

  const updatedCourse = {
    title,
    price: +price,
    registersCount,
    category: "فرانت اند",
    discount: 0,
    desc: "توضیحات ندارد",
  };

  fetch(`${url}/${courseIdToUpdate}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(updatedCourse),
  }).then((response) => {
    if (response.status === 201) {
      fetchData();
      modalCourseScreen.classList.add("hidden");
      showToast("edit", "دوره با موفقیت ویرایش شد.");
    }
  });
}

document.addEventListener("DOMContentLoaded", getCourses);
createCourseBtn?.addEventListener("click", showCreateCourseModal);
