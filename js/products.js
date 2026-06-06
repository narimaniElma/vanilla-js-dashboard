import { data } from "./data.js";
import { getTheme } from "./theme.js";

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
              <button class="edit-btn" data-id="${product.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="remove-btn" data-id="${product.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        `,
    );
  });

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
          <span tabindex=${i} class="page ${i === currentProductPage ? "active" : ""}" >${i}</span>
        `,
    );
  }

  paginationProducts.querySelectorAll(".page").forEach((item) => {
    item.addEventListener("click", handleProductPagination);
  });
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
              type="text"
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
  const titleInput = document.querySelector("#product-title");
  const priceInput = document.querySelector("#product-price");
  const shortNameInput = document.querySelector("#product-shortName");

  const newProduct = {
    id: data.products.length + 1,
    title: titleInput.value,
    price: priceInput.value.toLocaleString(),
    slug: shortNameInput.value,
  };

  data.products.push(newProduct);
  showProductToast("create");
  updateProductsData();
}

function updateProductsData() {
  modalProductScreen.classList.add("hidden");

  showProducts();
  productsCountElem.innerHTML = data.products.length;
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
  removeProductModal();
  modalProductScreen.classList.remove("hidden");

  mainProductIndex = data.products.findIndex(function (product) {
    return product.id === Number(productId);
  });
}

function removeProduct() {
  data.products.splice(mainProductIndex, 1);

  showProductToast("delete");
  updateProductsData();
}

function showEditProductModal(productId) {
  mainProduct = data.products.find(function (product) {
    return product.id === Number(productId);
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
              value=${product.price.toLocaleString()}
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
  const titleInput = document.querySelector("#product-title");
  const priceInput = document.querySelector("#product-price");
  const shortNameInput = document.querySelector("#product-shortName");

  mainProduct.title = titleInput.value;
  mainProduct.price = priceInput.value.toLocaleString();
  mainProduct.slug = shortNameInput.value;

  showProductToast("edit");
  updateProductsData();
}

document.addEventListener("DOMContentLoaded", getProductsData);
createProductBtn?.addEventListener("click", showCreateProductModal);
