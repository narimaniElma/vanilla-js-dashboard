import { data } from "./data.js";
import { getTheme } from "./theme.js";

const usersCountElem = document.querySelector(".users-data");
const createUserBtn = document.querySelector("#create-user");
const usersTable = document.querySelector(".users");
const modalUserScreen = document.querySelector(".modal-user-screen");
const modalUserContainer = document.querySelector(".modal-user");
const paginationUsers = document.querySelector(".pagination-users");
const userToast = document.querySelector(".user-toast");
const userToastProcessElem = document.querySelector(".process-user");
const userToastContentElem = document.querySelector(".toast-content-user");

let mainUserIndex;
let mainUser;
const userPerPage = 4;
let users;
let usersStartIndex = 0;
let usersEndIndex = userPerPage;
let currentUserPage;

function showUsers() {
  usersTable.innerHTML = "";

  users = data.users.slice(usersStartIndex, usersEndIndex);

  users.forEach(function (user) {
    usersTable.insertAdjacentHTML(
      "beforeend",
      `
            <div class="tableRow">
                <p class="user-fullName">${user.name}</p>
                <p class="user-username">${user.username}</p>
                <p class="user-email">${user.email}</p>
                <p class="user-password">${user.password}</p>
                <div class="product-manage">
                    <button class="edit-btn" data-id="${user.id}">                        
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="remove-btn" data-id="${user.id}">
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

function getUsersData() {
  let users = JSON.parse(localStorage.getItem("users"));
  getTheme();

  if (users) {
    data.users = users;
  } else {
    setUsersInLocalStorage();
  }

  showUsers();
  generateUsersPagination();

  usersCountElem.innerHTML = data.users.length;
}

function generateUsersPagination(activePageBox = 1) {
  paginationUsers.innerHTML = "";

  let userPagesCount = Math.ceil(data.users.length / userPerPage);

  for (let i = 0; i < userPagesCount; i++) {
    const pageNumber = i + 1;
    paginationUsers.insertAdjacentHTML(
      "beforeend",
      `
          <span tabindex=${pageNumber} data-id='${pageNumber}' class="page ${pageNumber == activePageBox ? "active" : ""}">${pageNumber}
          </span>
        `,
    );
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

function showUserToast(type) {
  userToast.classList.remove("hidden");
  let step = 1;
  userToastContentElem.innerHTML = "";

  switch (type) {
    case "delete": {
      userToast.className = "toast user-toast failed";
      userToastContentElem.innerHTML = "کاربر با موفقیت حذف شد.";
      break;
    }
    case "edit": {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "کاربر با موفقیت ویرایش شد.";
      break;
    }
    case "create": {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "کاربر با موفقیت ایجاد شد.";
      break;
    }
    default: {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "کاربر با موفقیت ایجاد شد.";
    }
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
  removeUserModal();
  modalUserScreen.classList.remove("hidden");

  mainUserIndex = data.users.findIndex(function (user) {
    return user.id === Number(userId);
  });
}

function removeUser() {
  data.users.splice(mainUserIndex, 1);

  if ((data.users.length + 1) % userPerPage === 1) {
    generateUsersPagination(currentUserPage);
  }

  updateUsersData();
  showUserToast("delete");
}

function updateUsersData() {
  modalUserScreen.classList.add("hidden");
  usersCountElem.innerHTML = data.users.length;

  showUsers();
  setUsersInLocalStorage();
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
            value='${user.name}'
            type="text"
            class="modal-input"
            placeholder="نام و نام خانوادگی را وارد نمائید ..."
            id="user-fullName"
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
          <input
            required
            type="text"
            value='${user.password}'
            class="modal-input"
            id="user-password"
            placeholder="رمز عبور را وارد نمائید ..."
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
  mainUser = data.users.find(function (user) {
    return user.id === Number(userId);
  });

  editUserModal(mainUser);

  modalUserScreen.classList.remove("hidden");
}

function editUser() {
  const fullName = document.querySelector("#user-fullName").value;
  const username = document.querySelector("#user-username").value;
  const email = document.querySelector("#user-email").value;
  const password = document.querySelector("#user-password").value;

  const isValid = handleValidation(fullName, username, email, password);

  if (!isValid) return;

  mainUser.name = fullName;
  mainUser.username = username;
  mainUser.email = email;
  mainUser.password = password;

  showUserToast("edit");
  updateUsersData();
}

function setUsersInLocalStorage() {
  localStorage.setItem("users", JSON.stringify(data.users));
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
                  placeholder="نام و نام خانوادگی را وارد نمائید ..."
                  id="user-fullName"
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
                <input
                  required
                  type="text"
                  class="modal-input"
                  id="user-password"
                  placeholder="رمز عبور را وارد نمائید ..."
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
  const fullName = document.querySelector("#user-fullName").value;
  const username = document.querySelector("#user-username").value;
  const email = document.querySelector("#user-email").value;
  const password = document.querySelector("#user-password").value;

  const isValid = handleValidation(fullName, username, email, password);

  if (!isValid) return;

  const newUser = {
    id: data.users.length + 1,
    name: fullName,
    username,
    email,
    password,
  };

  data.users.push(newUser);

  if (newUser.id % userPerPage === 1) {
    generateUsersPagination(currentUserPage);
  }
  showUserToast("create");
  updateUsersData();
}

const handleValidation = (fullName, username, email, password) => {
  const errorElem = document.querySelector(".error");
  errorElem.innerHTML = "";

  const errors = [];

  if (fullName.length < 3) {
    errors.push("نام باید حداقل ۳ کاراکتر باشد.");
  }

  if (username.length < 3) {
    errors.push("نام کاربری باید حداقل ۳ کاراکتر باشد.");
  }

  if (!email.includes("@") || email.length < 8) {
    errors.push("ایمیل معتبر نیست.");
  }

  if (
    data.users.some((user) => user.email === email && mainUser.id !== user.id)
  ) {
    errors.push("این ایمیل قبلاً ثبت شده است.");
  }

  if (password.length < 8) {
    errors.push("رمز باید حداقل ۸ کاراکتر باشد.");
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

document.addEventListener("DOMContentLoaded", getUsersData);
createUserBtn?.addEventListener("click", showCreateUserModal);
