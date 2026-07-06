import { getTheme } from "./theme.js";

const url = "https://js-cms.iran.liara.run/api/courses";

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

let mainProduct;

const productPerPage = 4;
let courses;
let courseId;
let productsStartIndex = 0;
let productsEndIndex = productPerPage;
let currentProductPage;

const fetchData = () => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      courses = data;
      showProducts();
      setCache("courses", courses);
      productsCountElem.innerHTML = courses.length;
    });
};

function showProducts() {
  productsTable.innerHTML = "";

  // products = courses.slice(productsStartIndex, productsEndIndex);

  if (courses) {
    courses.forEach(function (product) {
      productsTable.insertAdjacentHTML(
        "beforeend",
        `
          <div class="tableRow">
            <p class="product-title">${product.title}</p>
            <p class="product-price">${product.price.toLocaleString()}</p>
            <p class="product-registersCount">${product.registersCount}</p>
            <div class="product-manage">
              <button class="edit-btn" data-id="${product._id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" data-id="${product._id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
      );
    });
  }

  productsTable.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    const removeBtn = e.target.closest(".remove-btn");

    if (editBtn) {
      showEditProductModal(editBtn.dataset.id);
    }

    if (removeBtn) {
      showRemoveProductModal(removeBtn.dataset.id);
    }
  });
}

window.addEventListener("load", fetchData);

function getProductsData() {
  const cashe = getCache("courses", 5 * 60 * 1000);

  if (cashe) {
    courses = cashe.data;
    showProducts();
  } else {
    fetchData();
  }

  getTheme();

  generateProductsPagination();

  if (courses) {
    productsCountElem.innerHTML = courses.length;
  }
}

function generateProductsPagination(activePageBox = 1) {
  paginationProducts.innerHTML = "";

  if (courses) {
    let productPagesCount = Math.ceil(courses.length / productPerPage);

    for (let i = 0; i < productPagesCount; i++) {
      const pageNumber = i + 1;
      paginationProducts.insertAdjacentHTML(
        "beforeend",
        `
            <span tabindex=${pageNumber} data-id='${pageNumber}' class="page ${pageNumber == activePageBox ? "active" : ""}" >${pageNumber}</span>
          `,
      );
    }
  }

  const pageBoxes = paginationProducts.querySelectorAll(".page");

  pageBoxes.forEach((pageBox) => {
    pageBox.addEventListener("click", (event) => {
      currentProductPage = event.target.dataset._id;

      pageBoxes.forEach((item) => {
        item.classList.remove("active");
      });

      event.target.classList.add("active");
      changePageHandler(currentProductPage);
    });
  });
}

function changePageHandler(selectedPage) {
  productsStartIndex = (selectedPage - 1) * productPerPage;
  productsEndIndex = productsStartIndex + productPerPage;

  showProducts();
}

const setCache = (key, data) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      savedAt: Date.now(),
    }),
  );
};

function getCache(key, maxTime) {
  const cache = JSON.parse(localStorage.getItem(key));

  if (!cache) return null;

  const isExpired = Date.now() - cache.savedAt > maxTime;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return cache.data;
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
              type="text"
              class="modal-input"
              placeholder="تعداد دانشجو دوره را وارد نمائید ..."
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

  modalProductContainer
    .querySelector(".submit")
    .addEventListener("click", createNewProduct);

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
  const title = document.querySelector("#product-title").value;
  const price = document.querySelector("#product-price").value;
  const shortName = document.querySelector("#product-registersCount").value;

  const isValid = handleValidation(title, price);

  if (!isValid) return;

  const newProduct = {
    id: courses.length + 1,
    title,
    price: Number(price),
    slug: shortName,
  };

  courses.push(newProduct);

  if (newProduct._id % productPerPage === 1) {
    generateProductsPagination(currentProductPage);
  }

  showProductToast("create");
  updateProductsData();
}

const handleValidation = (title, price) => {
  const errorElem = document.querySelector(".error");
  const errors = [];

  if (title.length < 3) {
    errors.push("عنوان دوره باید حداقل 3 کاراکتر باشد.");
  }

  if (
    courses.find(function (product) {
      return product.title === title && mainProduct._id !== product._id;
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

function updateProductsData() {
  modalProductScreen.classList.add("hidden");
  productsCountElem.innerHTML = courses.length;

  showProducts();
  setProductsInLocalStorage();
}

function showProductToast(type) {
  productToast.classList.remove("hidden");
  let step = 1;
  productToastContentElem.innerHTML = "";

  switch (type) {
    case "delete": {
      productToast.className = "toast product-toast failed";
      productToastContentElem.innerHTML = "دوره با موفقیت حذف شد.";
      break;
    }
    case "edit": {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "دوره با موفقیت ویرایش شد.";
      break;
    }

    case "create": {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "دوره با موفقیت ایجاد شد.";
      break;
    }

    default: {
      productToast.className = "toast product-toast success";
      productToastContentElem.innerHTML = "دوره با موفقیت ایجاد شد.";
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

  modalProductContainer
    .querySelector(".submit")
    .addEventListener("click", removeProduct);

  hideProductModal();
}

function showRemoveProductModal(productId) {
  courseId = productId;
  removeProductModal();
  modalProductScreen.classList.remove("hidden");
}

function removeProduct() {
  fetch(`${url}/${courseId}`, {
    method: "DELETE",
  }).then((response) => {
    console.log(response);
    updateProductsData();
    showProductToast("delete");
  });

  if ((courses.length + 1) % productPerPage === 1) {
    generateProductsPagination(currentProductPage);
  }
}

function showEditProductModal(productId) {
  mainProduct = courses.find(function (product) {
    return product._id === Number(productId);
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
            <h3>ویرایش دوره</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              required
              type="text"
              value='${product.title}'
              class="modal-input"
              placeholder="عنوان دوره را وارد نمائید ..."
              id="product-title"
            />
            <input
              required
              type="number"
              value='${product.price}'
              class="modal-input"
              placeholder="قیمت دوره را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              value='${product.slug}'
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

  modalProductContainer
    .querySelector(".submit")
    .addEventListener("click", editProduct);

  hideProductModal();
}

function editProduct() {
  const title = document.querySelector("#product-title").value;
  const price = document.querySelector("#product-price").value;
  const shortName = document.querySelector("#product-registersCount").value;

  const isValid = handleValidation(title, price);

  if (!isValid) return;

  mainProduct.title = title;
  mainProduct.price = Number(price);
  mainProduct.slug = shortName;

  showProductToast("edit");
  updateProductsData();
}

document.addEventListener("DOMContentLoaded", getProductsData);
createProductBtn?.addEventListener("click", showCreateProductModal);
