const toggleSidebarBtn = document.querySelector(".toggle-sidebar");
const sidebarElem = document.querySelector(".sidebar");
const usersCountElem = document.querySelector(".users-data");
const createUserBtn = document.querySelector("#create-user");
const usersTable = document.querySelector(".users");
const modalUserScreen = document.querySelector(".modal-user-screen");
const modalUserContainer = document.querySelector(".modal-user");
const paginationUsers = document.querySelector(".pagination-users");
const userToast = document.querySelector(".user-toast");
const userToastProcessElem = document.querySelector(".process-user");
const userToastContentElem = document.querySelector(".toast-content-user");
const themeButton = document.querySelector(".theme-button");
const htmlTags = document.querySelectorAll("html");

const data = {
  users: [
    {
      id: 1,
      name: "الما نریمانی",
      username: "elma",
      email: "elma@gmail.com",
      password: "elma0101",
    },
    {
      id: 2,
      name: "مینا عابدی",
      username: "mina",
      email: "mina@gmail.com",
      password: "mina0101",
    },
    {
      id: 3,
      name: "پیمان احمدی",
      username: "peyman",
      email: "peyman12@gmail.com",
      password: "Ahmadi0101",
    },
    {
      id: 4,
      name: "سینا اسدی",
      username: "sina",
      email: "sina@gmail.com",
      password: "sina0101",
    },
    {
      id: 5,
      name: "عاطفه صمدی",
      username: "atefeh",
      email: "atefeh@gmail.com",
      password: "atefeh0101",
    },
    {
      id: 6,
      name: "هانیه قربانی",
      username: "haniyeh",
      email: "haniyeh@gmail.com",
      password: "haniyeh0101",
    },
    {
      id: 7,
      name: "علی عالمی",
      username: "ali",
      email: "ali@gmail.com",
      password: "ali0101",
    },
    {
      id: 8,
      name: "مهتاب سهرابی",
      username: "mahtab",
      email: "mahtab@gmail.com",
      password: "mahtab0101",
    },
    {
      id: 9,
      name: "امیر محمودی",
      username: "amir",
      email: "amir@gmail.com",
      password: "amir0101",
    },
  ],
  products: [
    {
      id: 1,
      title: "کفش ورزشی",
      price: 8000000,
      slug: "kafsh-a1",
    },
    {
      id: 2,
      title: "کیف ورزشی",
      price: 3000000,
      slug: "kif-a1",
    },
    {
      id: 3,
      title: "شلوار ورزشی",
      price: 5000000,
      slug: "shalvar-a1",
    },
    {
      id: 4,
      title: "کاپشن ورزشی",
      price: 8000000,
      slug: "kapshan-a1",
    },
    {
      id: 5,
      title: "مانتو",
      price: 1000000,
      slug: "manto-a1",
    },
    {
      id: 6,
      title: "شلوارلی",
      price: 2000000,
      slug: "shalvarli-a1",
    },
    {
      id: 7,
      title: "شال",
      price: 500000,
      slug: "shal-a1",
    },
    {
      id: 8,
      title: "کلاه ورزشی",
      price: 300000,
      slug: "kolah-a1",
    },
    {
      id: 9,
      title: "جوراب",
      price: 100000,
      slug: "jorab-a1",
    },
    {
      id: 10,
      title: "عینک",
      price: 4000000,
      slug: "einak-a1",
    },
    {
      id: 11,
      title: "کوله پشتی",
      price: 2500000,
      slug: "koleh-a1",
    },
    {
      id: 12,
      title: "تیشرت",
      price: 600000,
      slug: "tishert-a1",
    },
  ],
};

let mainUserIndex;
let mainUser;
const userPerPage = 4;
let users;
let usersStartIndex = 0;
let usersEndIndex = userPerPage;
let currentUserPage = 1;
let theme = "light";

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
                    <button class="edit-btn" onclick='showEditUserModal(${user.id})'>                        
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="remove-btn" onclick='showRemoveUserModal(${user.id})'>
                        <i class="fas fa-ban"></i>
                    </button>
                </div>
                </div>
        `,
    );
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
          <span tabindex=${i} class="page ${i === currentUserPage ? "active" : ""}" onclick='handleUserPagination(event)'>
            ${i}
          </span>
        `,
    );
  }
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
            <button class="submit" onclick='removeUser()'>تائید</button>
        </footer>
    `,
  );

  hideUserModal();
}

function showRemoveUserModal(userId) {
  removeUserModal();
  modalUserScreen.classList.remove("hidden");

  mainUserIndex = data.users.findIndex(function (user) {
    return user.id === userId;
  });
}

function removeUser() {
  data.users.splice(mainUserIndex, 1);

  showUserToast("delete");
  updateUsersData();
}

function updateUsersData() {
  modalUserScreen.classList.add("hidden");
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
          <button class="submit" onclick='editUser()'>تائید</button>
        </footer>
    `,
  );

  hideUserModal();
}

function showEditUserModal(userId) {
  mainUser = data.users.find(function (user) {
    return user.id === userId;
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
                <button class="submit" onclick='createNewUser()'>تائید</button>
            </footer>
        `,
  );

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

function toggleMenue() {
  sidebarElem.classList.toggle("open");
}

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

function getTheme() {
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

toggleSidebarBtn.addEventListener("click", toggleMenue);
createUserBtn?.addEventListener("click", showCreateUserModal);
themeButton?.addEventListener("click", changeTheme);

// products
const productsTable = document.querySelector(".products");
const createProductBtn = document.querySelector("#create-product");
const modalProductScreen = document.querySelector(".modal-product-screen");
const modalProductContainer = document.querySelector(".modal-product");
const productsCountElem = document.querySelector(".products-data");
const paginationProducts = document.querySelector(".pagination-products");
const productToast = document.querySelector(".product-toast");
const productToastProcessElem = document.querySelector(".process-product");
const productToastContentElem = document.querySelector(
  ".toast-content-product",
);

let mainProductIndex;
let mainProduct;

const productPerPage = 4;
let products;
let productsStartIndex = 0;
let productsEndIndex = productPerPage;
let currentProductPage = 1;

function showProducts() {
  productsTable.innerHTML = "";
  products = data.products.slice(productsStartIndex, productsEndIndex);

  products.forEach(function (product) {
    productsTable.insertAdjacentHTML(
      "beforeend",
      `
          <div class="tableRow">
            <p class="product-title">${product.title}</p>
            <p class="product-price">${product.price.toLocaleString()}</p>
            <p class="product-shortName">${product.slug}</p>
            <div class="product-manage">
              <button class="edit-btn" onclick='showEditProductModal(${product.id})'>
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" onclick='showRemoveProductModal(${product.id})'>
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
    );
  });
}

function getProductsData() {
  let products = JSON.parse(localStorage.getItem("products"));
  getTheme();

  if (products) {
    data.products = products;
  } else {
    setProductsInLocalStorage();
  }

  showProducts();
  showProductsPagination();

  productsCountElem.innerHTML = data.products.length;
}

function showProductsPagination() {
  paginationProducts.innerHTML = "";
  let productPages = Math.ceil(data.products.length / productPerPage);

  for (let i = 1; i <= productPages; i++) {
    paginationProducts.insertAdjacentHTML(
      "beforeend",
      `
          <span tabindex=${i} class="page ${i === currentProductPage ? "active" : ""}" onclick='handleProductPagination(event)'>${i}</span>
        `,
    );
  }
}

function handleProductPagination(event) {
  const paginationProductElems = paginationProducts.querySelectorAll(".page");
  currentProductPage = event.target.innerHTML;

  productsStartIndex = (currentProductPage - 1) * productPerPage;
  productsEndIndex = currentProductPage * productPerPage;

  showProducts();

  paginationProductElems.forEach(function (paginationProductElem) {
    if (paginationProductElem.innerHTML === currentProductPage) {
      paginationProductElem.classList.add("active");
    } else {
      paginationProductElem.classList.remove("active");
    }
  });
}

function setProductsInLocalStorage() {
  localStorage.setItem("products", JSON.stringify(data.products));
}

function showCreateProductModal() {
  modalProductScreen.classList.remove("hidden");

  createProductModal();
}

function createProductModal() {
  modalProductContainer.innerHTML = "";

  modalProductContainer.insertAdjacentHTML(
    "beforeend",
    `
          <header class="modal-header">
            <h3>ایجاد محصول</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              type="text"
              class="modal-input"
              placeholder="عنوان محصول را وارد نمائید ..."
              id="product-title"
            />
            <input
              type="number"
              class="modal-input"
              placeholder="قیمت محصول را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              class="modal-input"
              placeholder="عنوان کوتاه محصول را وارد نمائید ..."
              id="product-shortName"
            />
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit" onclick='createNewProduct()'>تائید</button>
          </footer>
    `,
  );

  hideProductModal();
}

function hideProductModal() {
  const closeModalIcon = modalProductContainer.querySelector(".close-modal");
  const closeModalBtn = modalProductContainer.querySelector(".cancel");

  closeModalIcon.addEventListener("click", function () {
    modalProductScreen.classList.add("hidden");
  });

  closeModalBtn.addEventListener("click", function () {
    modalProductScreen.classList.add("hidden");
  });
}

function createNewProduct() {
  const titleInput = document.querySelector("#product-title");
  const priceInput = document.querySelector("#product-price");
  const shortNameInput = document.querySelector("#product-shortName");

  const newProduct = {
    id: data.products.length + 1,
    title: titleInput.value,
    price: priceInput.value,
    slug: shortNameInput.value,
  };

  data.products.push(newProduct);
  showProductToast("create");
  updateProductsData();
}

function updateProductsData() {
  modalProductScreen.classList.add("hidden");

  showProducts();
  setProductsInLocalStorage();
  showProductsPagination();
}

function showProductToast(type) {
  productToast.classList.remove("hidden");
  let step = 1;
  productToastContentElem.innerHTML = "";

  switch (type) {
    case "delete": {
      productToast.className = "toast product-toast failed";
      productToastContentElem.innerHTML = "محصول با موفقیت حذف شد.";
      break;
    }
    case "edit": {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "محصول با موفقیت ویرایش شد.";
      break;
    }

    case "create": {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "محصول با موفقیت ایجاد شد.";
      break;
    }

    default: {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "محصول با موفقیت ایجاد شد.";
    }
  }

  const productToastInterval = setInterval(() => {
    step++;

    if (step > 110) {
      clearInterval(productToastInterval);
      step = 1;
      productToast.classList.add("hidden");
    }

    productToastProcessElem.style.width = `${step}%`;
  }, 50);
}

function removeProductModal() {
  modalProductContainer.innerHTML = "";

  modalProductContainer.insertAdjacentHTML(
    "beforeend",
    `         
          <i class="ui-border top red"></i>
          <i class="ui-border bottom red"></i>
          <header class="modal-header">
            <h3>حذف محصول</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <p class="remove-text">آیا از حذف این محصول اطمینان دارید؟</p>
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit" onclick='removeProduct()'>تائید</button>
          </footer>
    `,
  );

  hideProductModal();
}

function showRemoveProductModal(productId) {
  removeProductModal();
  modalProductScreen.classList.remove("hidden");

  mainProductIndex = data.products.findIndex(function (product) {
    return product.id === productId;
  });
}

function removeProduct() {
  data.products.splice(mainProductIndex, 1);

  showProductToast("delete");
  updateProductsData();
}

function showEditProductModal(productId) {
  mainProduct = data.products.find(function (product) {
    return product.id === productId;
  });

  editProductModal(mainProduct);

  modalProductScreen.classList.remove("hidden");
}

function editProductModal(product) {
  modalProductContainer.innerHTML = "";

  modalProductContainer.insertAdjacentHTML(
    "beforeend",
    `         
         <header class="modal-header">
            <h3>ویرایش محصول</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              type="text"
              value=${product.title}
              class="modal-input"
              placeholder="عنوان محصول را وارد نمائید ..."
              id="product-title"
            />
            <input
              type="text"
              value=${product.price}
              class="modal-input"
              placeholder="قیمت محصول را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              value=${product.slug}
              class="modal-input"
              placeholder="عنوان کوتاه محصول را وارد نمائید ..."
              id="product-shortName"
            />
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit" onclick='editProduct()'>تائید</button>
          </footer>
    `,
  );

  hideProductModal();
}

function editProduct() {
  const titleInput = document.querySelector("#product-title");
  const priceInput = document.querySelector("#product-price");
  const shortNameInput = document.querySelector("#product-shortName");

  mainProduct.title = titleInput.value;
  mainProduct.price = priceInput.value;
  mainProduct.slug = shortNameInput.value;

  showProductToast("edit");
  updateProductsData();
}

createProductBtn?.addEventListener("click", showCreateProductModal);

// home page
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
          <div class="product-manage">
            <button class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button class="remove-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,
    );
  });
}
