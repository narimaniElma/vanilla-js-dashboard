import { data } from "./data.js";

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
let currentUserPage = 1;

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

  if (users) {
    data.users = users;
  } else {
    setUsersInLocalStorage();
  }

  showUsers();
  showUsersPagination();

  usersCountElem.innerHTML = data.users.length;
}

function showUsersPagination() {
  paginationUsers.innerHTML = "";

  let userPages = Math.ceil(data.users.length / userPerPage);

  for (let i = 1; i <= userPages; i++) {
    paginationUsers.insertAdjacentHTML(
      "beforeend",
      `
          <span tabindex=${i} class="page ${i === currentUserPage ? "active" : ""}">
            ${i}
          </span>
        `,
    );
  }

  paginationUsers.querySelectorAll(".page").forEach((item) => {
    item.addEventListener("click", handleUserPagination);
  });
}

function handleUserPagination(event) {
  const paginationUserElems = paginationUsers.querySelectorAll(".page");
  currentUserPage = event.target.innerHTML;

  usersStartIndex = (currentUserPage - 1) * userPerPage;
  usersEndIndex = currentUserPage * userPerPage;

  showUsers();

  paginationUserElems.forEach(function (paginationUserElem) {
    if (paginationUserElem.innerHTML === currentUserPage) {
      paginationUserElem.classList.add("active");
    } else {
      paginationUserElem.classList.remove("active");
    }
  });
}

function showUserToast(type) {
  userToast.classList.remove("hidden");
  let step = 1;
  userToastContentElem.innerHTML = "";

  switch (type) {
    case "delete": {
      userToast.className = "toast user-toast failed";
      userToastContentElem.innerHTML = "محصول با موفقیت حذف شد.";
      break;
    }
    case "edit": {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "محصول با موفقیت ویرایش شد.";
      break;
    }
    case "create": {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "محصول با موفقیت ایجاد شد.";
      break;
    }
    default: {
      userToast.className = "toast user-toast success";
      userToastContentElem.innerHTML = "محصول با موفقیت ایجاد شد.";
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

  showUserToast("delete");
  updateUsersData();
}

function updateUsersData() {
  modalUserScreen.classList.add("hidden");
  usersCountElem.innerHTML = data.users.length;

  showUsers();
  setUsersInLocalStorage();
  showUsersPagination();
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
            value=${user.name}
            type="text"
            class="modal-input"
            placeholder="نام و نام خانوادگی را وارد نمائید ..."
            id="user-fullName"
          />
          <input
            type="text"
            value=${user.username}
            class="modal-input"
            id="user-username"
            placeholder="نام کاربری را وارد نمائید ..."
          />
          <input
            type="email"
            value=${user.email}
            class="modal-input"
            id="user-email"
            placeholder="ایمیل را وارد نمائید ..."
          />
          <input
            type="text"
            value=${user.password}
            class="modal-input"
            id="user-password"
            placeholder="رمز عبور را وارد نمائید ..."
          />
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
  const fullNameInput = document.querySelector("#user-fullName");
  const usernameInput = document.querySelector("#user-username");
  const emailInput = document.querySelector("#user-email");
  const passwordInput = document.querySelector("#user-password");

  mainUser.name = fullNameInput.value;
  mainUser.username = usernameInput.value;
  mainUser.email = emailInput.value;
  mainUser.password = passwordInput.value;

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
                  type="text"
                  class="modal-input"
                  placeholder="نام و نام خانوادگی را وارد نمائید ..."
                  id="user-fullName"
                />
                <input
                  type="text"
                  class="modal-input"
                  id="user-username"
                  placeholder="نام کاربری را وارد نمائید ..."
                />
                <input
                  type="email"
                  class="modal-input"
                  id="user-email"
                  placeholder="ایمیل را وارد نمائید ..."
                />
                <input
                  type="text"
                  class="modal-input"
                  id="user-password"
                  placeholder="رمز عبور را وارد نمائید ..."
                />
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
  const fullNameInput = document.querySelector("#user-fullName");
  const usernameInput = document.querySelector("#user-username");
  const emailInput = document.querySelector("#user-email");
  const passwordInput = document.querySelector("#user-password");

  const newUser = {
    id: data.users.length + 1,
    name: fullNameInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  data.users.push(newUser);
  updateUsersData();
  showUserToast("create");
}

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
