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
let currentProductPage;

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
  generateProductsPagination();

  productsCountElem.innerHTML = data.products.length;
}

function generateProductsPagination(activePageBox = 1) {
  paginationProducts.innerHTML = "";

  let productPagesCount = Math.ceil(data.products.length / productPerPage);

  for (let i = 0; i < productPagesCount; i++) {
    const pageNumber = i + 1;
    paginationProducts.insertAdjacentHTML(
      "beforeend",
      `
          <span tabindex=${pageNumber} data-id='${pageNumber}' class="page ${pageNumber == activePageBox ? "active" : ""}" >${pageNumber}</span>
        `,
    );
  }

  const pageBoxes = paginationProducts.querySelectorAll(".page");

  pageBoxes.forEach((pageBox) => {
    pageBox.addEventListener("click", (event) => {
      currentProductPage = event.target.dataset.id;

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
              required
              type="text"
              class="modal-input"
              min='3'
              placeholder="عنوان محصول را وارد نمائید ..."
              id="product-title"
            />
            <input
              required
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
  const shortName = document.querySelector("#product-shortName").value;

  const isValid = handleValidation(title, price);

  if (!isValid) return;

  const newProduct = {
    id: data.products.length + 1,
    title,
    price: Number(price),
    slug: shortName,
  };

  data.products.push(newProduct);

  if (newProduct.id % productPerPage === 1) {
    generateProductsPagination(currentProductPage);
  }

  showProductToast("create");
  updateProductsData();
}

const handleValidation = (title, price) => {
  const errorElem = document.querySelector(".error");
  const errors = [];

  if (title.length < 3) {
    errors.push("عنوان محصول باید حداقل 3 کاراکتر باشد.");
  }

  if (!price) {
    errors.push("قیمت تعیین نشده است.");
  }
  if (
    data.products.find(function (product) {
      return product.title === title;
    })
  ) {
    errors.push("محصولی با این عنوان قبلاً ثبت شده است.");
  }

  if (errors.length) {
    errorElem.innerHTML = errors.join("<br/>");
    return false;
  }

  return true;
};

function updateProductsData() {
  modalProductScreen.classList.add("hidden");
  productsCountElem.innerHTML = data.products.length;

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

  if ((data.products.length + 1) % productPerPage === 1) {
    generateProductsPagination(currentProductPage);
  }

  updateProductsData();
  showProductToast("delete");
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
              required
              type="text"
              value='${product.title}'
              class="modal-input"
              placeholder="عنوان محصول را وارد نمائید ..."
              id="product-title"
            />
            <input
              required
              type="number"
              value='${product.price}'
              class="modal-input"
              placeholder="قیمت محصول را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              value='${product.slug}'
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
  mainProduct.price = Number(priceInput.value);
  mainProduct.slug = shortNameInput.value;

  showProductToast("edit");
  updateProductsData();
}

document.addEventListener("DOMContentLoaded", getProductsData);
createProductBtn?.addEventListener("click", showCreateProductModal);
