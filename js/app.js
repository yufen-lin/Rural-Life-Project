const hotProducts = document.querySelector(".swiper-wrapper");
const cartBtn = document.querySelector(".cart-btn");
const cartItemsAmount = document.querySelector(".cart-items-amount");
const productInfoModal = document.querySelector(".modal-content .card .row");

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
    products = products.filter((product) => product.hot === true);

    let result = "";
    products.forEach((product) => {
      result += `<li class="swiper-slide product-card card shadow-sm mb-3" data-id="${product.id}">
                                <div class="img-container">
                                    <img src="${product.picture}" alt="product" class="product-img" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#productInfoModal">
                                </div>
                                <div class="card-body d-flex flex-column justify-content-center">
                                <h2 class="card-title fs-4 text-center fw-bold my-1 lh-sm">${product.name}</h2>
                                <span class="card-subtitle fs-6 text-center fw-bold my-1 lh-s">${product.nameEnglish}</span>
                                    <p class="card-text text-center fs-4 py-3">$ ${product.price}元</p>
                                </div>
                            </li>`;
    });
    hotProducts.innerHTML = result;
    this.getProductInfo();

    new Swiper(".swiper", {
      direction: "horizontal",
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: true,

      breakpoints: {
        576: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 25,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 25,
        },
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // 設置購物車內總商品數
  setCartItemsAmount(cart) {
    let itemsAmount = 0;
    cart.map((item) => {
      itemsAmount += item.quantity;
    });
    cartItemsAmount.innerText = itemsAmount;
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
    ui.displayProducts(products);
    Storage.saveProducts(products);
  });
});
