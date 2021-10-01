const productsDOM = document.querySelector(".products .row");
const cartItemsAmount = document.querySelector(".cart-items-amount");
const productInfoModal = document.querySelector(".modal-content .card .row");
const typeButtons = [...document.querySelectorAll(".type")];

let cart = [];

class Products {
  async getProducts() {
    try {
      let response = await fetch("data/products.json");
      let data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  setupApp() {
    cart = Storage.getCart();
    this.setCartItemsAmount(cart);
  }

  // 將產品渲染於畫面中
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="col-md-6 col-lg-4">
                            <li class="product-card card shadow-sm mb-3" data-id="${product.id}">
                                <div class="img-container">
                                    <img src="${product.picture}" alt="product" class="product-img" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#productInfoModal">
                                </div>
                                <div class="card-body d-flex flex-column justify-content-center">
                                <h2 class="card-title fs-5 text-center fw-bold my-1 lh-sm">${product.name}</h2>
                                <span class="card-subtitle fs-6 text-center fw-bold my-1 lh-s">${product.nameEnglish}</span>
                                    <span class="price card-text text-center fs-4 pt-2 pb-3">$ ${product.price}元</span>
                                    <button class="btn add-to-cart-btn text-white w-100 border-0 py-2" data-id="${product.id}"><i
                                            class="fas fa-shopping-cart me-1"></i>
                                        加入購物車</button>
                                </div>
                            </li>
                        </div>`;
    });
    productsDOM.innerHTML = result;
    this.getCartButtons();
    this.getProductInfo();
  }

  // 更改產品種類時篩選 products 並重新渲染畫面
  changeProductType(products) {
    typeButtons.forEach((type) => {
      type.addEventListener("click", (event) => {
        let type = event.target.dataset.type;
        typeButtons.forEach((type) => {
          type.classList.remove("active");
        });
        event.target.classList.add("active");

        // 篩選出該種類的產品
        let filteredProducts =
          type === "全部"
            ? products
            : products.filter((product) => product.type === type);
        this.displayProducts(filteredProducts);
      });
    });
  }

  // 監聽加入購物車按鈕
  getCartButtons() {
    const buttons = [...document.querySelectorAll(".add-to-cart-btn")];
    buttons.forEach((button) => {
      let id = button.dataset.id;

      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerHTML = `<i class="fas fa-shopping-basket me-2"></i>已加入購物車`;
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        event.target.innerHTML = `<i class="fas fa-shopping-basket me-2"></i>已加入購物車`;
        event.target.disabled = true;
        this.addToCart(id);
      });
    });
  }

  // 將商品加入購物車
  addToCart(id, quantityValue = 1) {
    let cartItem = { ...Storage.getProduct(id), quantity: quantityValue };
    cart = [...cart, cartItem];
    Storage.saveCart();
    this.setCartItemsAmount(cart);
  }

  // 設置購物車內總商品數
  setCartItemsAmount(cart) {
    let itemsAmount = 0;
    cart.map((item) => {
      itemsAmount += item.quantity;
    });
    cartItemsAmount.innerText = itemsAmount;
  }

  // 設置購物車金額小計
  setCartSubtotal(cart) {
    let subtotal = 0;
    cart.map((item) => {
      subtotal += item.price * item.quantity;
    });
    cartSubtotal.innerText = subtotal;
  }

  // 取得商品資訊
  getProductInfo() {
    const productImages = [...document.querySelectorAll(".product-img")];
    // productDOM = products;
    productImages.forEach((item) => {
      item.addEventListener("click", (event) => {
        let id = event.target.dataset.id;
        let product = Storage.getProduct(id);
        this.showProductInfo(product);
      });
    });
  }

  // 顯示商品資訊
  showProductInfo(product) {
    productInfoModal.innerHTML = `<div class="col-lg-5 col-xl-6">
                                    <img src="${product.picture}" alt="product-img" class="product-info-img img-cover">
                                </div>
                                <div class="col-lg-7 col-xl-6">
                                    <div class="info-content px-4 my-3 d-flex flex-column justify-content-between">
                                        <h2 class="fs-2 fw-bold my-1 my-md-3">${product.name}<span class="fs-5 card-subtitle"> (
                                                ${product.nameEnglish} ) </span></h2>
                                        <p class="lh-base pb-3 mt-xxl-2 mb-xxl-3">${product.introduction}</p>
                                        <span class="d-block bg-brown text-white px-4 py-2">購買資訊</span>
                                        <ul class="px-4 py-3 bg-lightColor mb-3 mb-xxl-4">
                                            <li class="lh-base">企業名稱：${product.shopInformation.name}</li>
                                            <li class="lh-base">聯絡人：${product.shopInformation.contact}</li>
                                            <li class="lh-base">聯絡電話：${product.shopInformation.tel}</li>
                                            <li class="lh-base">聯絡地址：${product.shopInformation.address}</li>
                                        </ul>
                                        <p>產品規格：${product.spec}</p>
                                        <span class="price fs-2 fw-bold align-self-end">$ ${product.price}</span>
                                    </div>
                                    <div class="info-footer px-4 my-3 d-flex justify-content-end">
                                        <div class="input-group">
                                            <button class="btn p-0" type="button"><i class="fas fa-minus p-1"
                                                    data-id="${product.id}"></i>
                                            </button>
                                            <input type="number" class="item-quantity ps-2" value="1">
                                            <button class="btn p-0" type="button"><i class="fas fa-plus p-1"
                                                    data-id="${product.id}"></i>
                                            </button>
                                        </div>
                                        <button class="btn add-to-cart-btn text-white border-0 py-1 ms-3" data-id="${product.id}"><i
                                                class="fas fa-shopping-cart me-1"></i>
                                            加入購物車</button>
                                    </div>
                                </div>
    `;

    const infoFooter = document.querySelector(".info-footer");
    const itemQuantity = document.querySelector(".item-quantity");
    const cartBtn = document.querySelector(".product-info .add-to-cart-btn");

    let value = itemQuantity.value;

    let inCart = cart.find((item) => item.id === product.id);
    if (inCart) {
      cartBtn.innerHTML = `<i class="fas fa-shopping-basket me-2"></i>已加入購物車`;
      cartBtn.disabled = true;
    }

    infoFooter.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-to-cart-btn")) {
        event.target.innerHTML = `<i class="fas fa-shopping-basket me-2"></i>已加入購物車`;
        event.target.disabled = true;
        this.addToCart(product.id, Number(value));
      } else if (event.target.classList.contains("fa-plus")) {
        value++;
        itemQuantity.value = value;
      } else if (event.target.classList.contains("fa-minus")) {
        if (value !== 1) {
          value--;
          itemQuantity.value = value;
        }
      }
    });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupApp();

  products.getProducts().then((products) => {
    Storage.saveProducts(products);
    ui.displayProducts(products);
    ui.changeProductType(products);
  });
});
