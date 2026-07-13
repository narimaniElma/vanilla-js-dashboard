import { getTheme } from "./theme.js";
import { setCache, getCache } from "../helpers/cashe.js";

const url = "https://cms-js-9f8e1-default-rtdb.firebaseio.com";

const usersCountElem = document.querySelector(".users-data");
const createUserBtn = document.querySelector("#create-user");
const usersTable = document.querySelector(".users");
const modalUserScreen = document.querySelector(".modal-user-screen");
const modalUserContainer = document.querySelector(".modal-user");
const paginationUsers = document.querySelector(".pagination-users");
const userToast = document.querySelector(".user-toast");
const userToastProcessElem = document.querySelector(".process-user");
const userToastContentElem = document.querySelector(".toast-content-user");

let mainUser;
const userPerPage = 4;
let users = [];
let userIdToRemove;
let userIdToUpdate;
let usersStartIndex = 0;
let usersEndIndex = userPerPage;
let currentUserPage;
let isLoading = true;

const fetchData = () => {
  if (isLoading) {
    usersTable.innerHTML = "";

    usersTable.insertAdjacentHTML(
      "beforeend",
      '<h4 style="text-align: center;">در حال دریافت اطلاعات</h4>',
    );
  }

  fetch(`${url}/users.json`)
    .then((response) => response.json())
    .then((data) => {
      users = Object.values(data);
      console.log("data", data);
      console.log("users", users);
      console.log("keys", Object.keys(data));
      usersCountElem.innerHTML = users.length;

      if (users.length === 0) {
        usersTable.innerHTML = "";

        usersTable.insertAdjacentHTML(
          "beforeend",
          '<h4 style="text-align: center">کاربری وجود ندارد.</h4>',
        );
      } else {
        showUsers();
      }

      setCache("users", users);
      generateUsersPagination();
    });

  isLoading = false;
};

function showUsers() {
  usersTable.innerHTML = "";

  if (users) {
    const usersSlice = users.slice(usersStartIndex, usersEndIndex);

    usersSlice.forEach(function (user) {
      usersTable.insertAdjacentHTML(
        "beforeend",
        `
            <div class="tableRow">
                <p class="user-firstname">${user.firstname} ${user.lastname}</p>
                <p class="user-username">${user.username}</p>
                <p class="user-email">${user.email}</p>
                <div class="product-manage">
                    <button class="edit-btn" data-id="${user._id}">                        
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="remove-btn" data-id="${user._id}">
                        <i class="fas fa-ban"></i>
                    </button>
                </div>
            </div>
        `,
      );
    });

    usersTable.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".edit-btn");
      const removeBtn = e.target.closest(".remove-btn");

      if (editBtn) {
        showEditUserModal(editBtn.dataset.id);
      }

      if (removeBtn) {
        showRemoveUserModal(removeBtn.dataset.id);
      }
    });
  }
}

function getUsersData() {
  const cashe = getCache("users", 5 * 60 * 1000);

  if (cashe) {
    users = cashe.data;
    showUsers();
  } else {
    fetchData();
  }

  getTheme();

  if (users) {
    usersCountElem.innerHTML = users.length;
  }
}

function generateUsersPagination(activePageBox = 1) {
  paginationUsers.innerHTML = "";

  if (users) {
    let userPagesCount = Math.ceil(users.length / userPerPage);

    for (let i = 0; i < userPagesCount; i++) {
      const pageNumber = i + 1;
      if (users.length < userPerPage) return;

      paginationUsers.insertAdjacentHTML(
        "beforeend",
        `
          <span tabindex=${pageNumber} data-id='${pageNumber}' class="page ${pageNumber == activePageBox ? "active" : ""}">${pageNumber}
          </span>
        `,
      );
    }
  }

  const pageBoxes = paginationUsers.querySelectorAll(".page");

  pageBoxes.forEach((pageBox) => {
    pageBox.addEventListener("click", (event) => {
      currentUserPage = event.target.dataset.id;

      pageBoxes.forEach((item) => {
        item.classList.remove("active");
      });

      event.target.classList.add("active");
      changePageHandler(currentUserPage);
    });
  });
}

function changePageHandler(selectedPage) {
  usersStartIndex = (selectedPage - 1) * userPerPage;
  usersEndIndex = usersStartIndex + userPerPage;

  showUsers();
}

function showUserToast(status, message) {
  userToast.classList.remove("hidden");
  userToastContentElem.innerHTML = message;
  let step = 1;

  if (status === "delete") {
    userToast.className = "toast user-toast failed";
  }

  if (status === "edit") {
    userToast.className = "toast user-toast success";
  }

  if (status === "create") {
    userToast.className = "toast user-toast success";
  }

  const userToastInterval = setInterval(() => {
    step++;

    if (step > 110) {
      clearInterval(userToastInterval);
      step = 1;
      userToast.classList.add("hidden");
    }

    userToastProcessElem.style.width = `${step}%`;
  }, 50);
}

function removeUserModal() {
  modalUserContainer.innerHTML = "";

  modalUserContainer.insertAdjacentHTML(
    "beforeend",
    `         
        <i class="ui-border top red"></i>
        <i class="ui-border bottom red"></i>
        <header class="modal-header">
            <h3>اخراج کاربر</h3>
            <button class="close-modal">
                <i class="fas fa-times"></i>
            </button>
        </header>
        <main class="modal-content">
            <p class="remove-text">آیا از اخراج(بن) کردن این کاربر اطمینان دارید؟</p>
        </main>
        <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
        </footer>
    `,
  );

  modalUserContainer
    .querySelector(".submit")
    .addEventListener("click", removeUser);

  hideUserModal();
}

function showRemoveUserModal(userId) {
  userIdToRemove = userId;
  removeUserModal();
  modalUserScreen.classList.remove("hidden");
}

function removeUser() {
  fetch(`${url}/${userIdToRemove}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status === 200) {
      fetchData();
      modalUserScreen.classList.add("hidden");
      showUserToast("delete", "کاربر با موفقیت حذف شد.");
    }
  });
}

function editUserModal(user) {
  modalUserContainer.innerHTML = "";

  modalUserContainer.insertAdjacentHTML(
    "beforeend",
    `         
        <header class="modal-header">
          <h3>ویرایش اطلاعات کاربر</h3>
          <button class="close-modal">
            <i class="fas fa-times"></i>
          </button>
        </header>
        <main class="modal-content">
          <input
            required
            value='${user.firstname}'
            type="text"
            class="modal-input"
            placeholder="نام را وارد نمائید ..."
            id="user-firstname"
          />
          <input
            required
            value='${user.lastname}'
            type="text"
            class="modal-input"
            placeholder="نام خانوادگی را وارد نمائید ..."
            id="user-lastname"
          />
          <input
            required
            type="text"
            value='${user.username}'
            class="modal-input"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            required
            type="email"
            value='${user.email}'
            class="modal-input"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <p class='error' style='min-height: 90px'></p>
        </main>
        <footer class="modal-footer">
          <button class="cancel">انصراف</button>
          <button class="submit">تائید</button>
        </footer>
    `,
  );

  modalUserContainer
    .querySelector(".submit")
    .addEventListener("click", editUser);

  hideUserModal();
}

function showEditUserModal(userId) {
  userIdToUpdate = userId;
  mainUser = users.find(function (user) {
    return user._id === userId;
  });

  editUserModal(mainUser);

  modalUserScreen.classList.remove("hidden");
}

function editUser() {
  const firstname = document.querySelector("#user-firstname").value;
  const lastname = document.querySelector("#user-lastname").value;
  const username = document.querySelector("#user-username").value;
  const email = document.querySelector("#user-email").value;

  const isValid = handleValidation(firstname, lastname, username, email);

  if (!isValid) return;

  // mainUser.name = fullName;
  // mainUser.username = username;
  // mainUser.email = email;

  const updatedUser = {
    firstname,
    lastname,
    username,
    email,
    age: 20,
    city: "تهران",
  };

  fetch(`${url}/${userIdToUpdate}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  }).then((response) => {
    if (response.status === 200) {
      modalUserScreen.classList.add("hidden");
      fetchData();
      showUserToast("edit", "کاربر با موفقیت ویرایش شد.");
    }
  });
}

function createUserModal() {
  modalUserContainer.innerHTML = "";

  modalUserContainer.insertAdjacentHTML(
    "beforeend",
    `
            <header class="modal-header">
                <h3>ایجاد کاربر جدید</h3>
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </header>
            <main class="modal-content">
                <input
                  required
                  type="text"
                  class="modal-input"
                  placeholder="نام را وارد نمائید ..."
                  id="user-firstname"
                />
                <input
                  required
                  type="text"
                  class="modal-input"
                  placeholder="نام خانوادگی را وارد نمائید ..."
                  id="user-lastname"
                />
                <input
                  required
                  type="text"
                  class="modal-input"
                  id="user-username"
                  placeholder="نام کاربری را وارد نمائید ..."
                />
                <input
                  required
                  type="email"
                  class="modal-input"
                  id="user-email"
                  placeholder="ایمیل را وارد نمائید ..."
                />
                <p class='error' style='min-height: 90px'></p>
            </main>
            <footer class="modal-footer">
                <button class="cancel">انصراف</button>
                <button class="submit">تائید</button>
            </footer>
        `,
  );

  modalUserContainer
    .querySelector(".submit")
    .addEventListener("click", createNewUser);

  hideUserModal();
}

function showCreateUserModal() {
  modalUserScreen.classList.remove("hidden");

  createUserModal();
}

function createNewUser() {
  const firstname = document.querySelector("#user-firstname").value;
  const lastname = document.querySelector("#user-lastname").value;
  const username = document.querySelector("#user-username").value;
  const email = document.querySelector("#user-email").value;

  const isValid = handleValidation(firstname, lastname, username, email);

  if (!isValid) return;

  const newUser = {
    firstname,
    lastname,
    username,
    email,
  };

  fetch(`${url}/users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  }).then((response) => {
    if (response.status === 200) {
      modalUserScreen.classList.add("hidden");
      fetchData();
      showUserToast("create", "کاربر با موفقیت ایجاد شد.");
    }
  });
}

const handleValidation = (firstname, lastname, username, email) => {
  const errorElem = document.querySelector(".error");
  errorElem.innerHTML = "";

  const errors = [];

  if (firstname.length < 3) {
    errors.push("نام باید حداقل ۳ کاراکتر باشد.");
  }

  if (lastname.length < 3) {
    errors.push("نام خانوادگی باید حداقل ۳ کاراکتر باشد.");
  }

  if (username.length < 3) {
    errors.push("نام کاربری باید حداقل ۳ کاراکتر باشد.");
  }

  if (!email.includes("@") || email.length < 8) {
    errors.push("ایمیل معتبر نیست.");
  }

  if (users.some((user) => user.email === email && mainUser._id !== user._id)) {
    errors.push("این ایمیل قبلاً ثبت شده است.");
  }

  if (errors.length) {
    errorElem.innerHTML = errors.join("<br>");
    return false;
  }

  return true;
};

function hideUserModal() {
  const closeModalIcon = modalUserContainer.querySelector(".close-modal");
  const closeModalBtn = modalUserContainer.querySelector(".cancel");

  closeModalIcon.addEventListener("click", function () {
    modalUserScreen.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", function () {
    modalUserScreen.classList.add("hidden");
  });
}

window.addEventListener("load", fetchData);
document.addEventListener("DOMContentLoaded", getUsersData);
createUserBtn?.addEventListener("click", showCreateUserModal);
