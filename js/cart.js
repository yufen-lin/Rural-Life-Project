const cartBtn = document.querySelector(".cart-btn");
const cartDOM = document.querySelector(".cart");
const cartItemsAmount = document.querySelector(".cart-items-amount");
const cartSubtotal = document.querySelector(".cart-subtotal");
const discount = document.querySelector(".discount");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const checkoutBtn = document.querySelector(".checkout-btn");
const checkoutInfo = document.querySelector(".checkout-info");
const confirmBtn = document.querySelector(".confirm-btn");
const orderDone = document.querySelector(".order-done");

let cart = [];

class UI {
  setupApp() {
    cart = Storage.getCart();
    this.setCartItemsAmount(cart);
    this.setOrderInformation(cart);
    this.populateCart(cart);
    this.cartLogic();
  }

  // 設置購物車內總商品數
  setCartItemsAmount(cart) {
    let itemsAmount = 0;
    cart.map((item) => {
      itemsAmount += item.quantity;
    });
    cartItemsAmount.innerText = itemsAmount;
  }

  // 設置購物車訂單資訊
  setOrderInformation(cart) {
    let subtotal = 0;
    let shipmentFee = 100;
    let discount = 0;
    let total = 0;

    cart.map((item) => {
      subtotal += item.price * item.quantity;
    });
    total = subtotal + shipmentFee + discount;
    cartSubtotal.innerText = subtotal;
    cartTotal.innerText = total;
  }

  // 將購物車內容加入購物清單中
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  // 渲染購物車內商品
  addCartItem(item) {
    const tr = document.createElement("tr");
    tr.classList.add("cart-item");

    tr.innerHTML = `<td class="d-none d-sm-block align-middle"><img src="${
      item.picture
    }" alt="product"></td>
                    <td class="fs-sm align-middle">${
                      item.name
                    }<span class="fs-sm d-none d-md-block my-2 lh-base"> ( ${
      item.nameEnglish
    } ) </span></td>
<td class="d-none d-md-table-cell fs-sm align-middle">$ ${item.price}</td>
<td class="fs-sm align-middle">
    <div class="input-group">
        <button class="btn p-0" type="button"><i class="fas fa-minus p-1 fs-sm" data-id="${
          item.id
        }"></i>
        </button>
        <input type="number" class="item-quantity ps-2 fs-sm" value="${
          item.quantity
        }">
        <button class="btn p-0" type="button"><i class="fas fa-plus p-1 fs-sm " data-id="${
          item.id
        }"></i>
        </button>
    </div>
</td>
<td class="align-middle">$ ${item.price * item.quantity}</td>
<td class="align-middle"><i class="remove-item-btn fas fa-trash-alt" data-id="${
      item.id
    }"></i>
</td>`;
    cartContent.appendChild(tr);
  }

  // 處理購物車內商品的行為
  cartLogic() {
    cartContent.addEventListener("click", (event) => {
      let targetItem = event.target;
      let id = targetItem.dataset.id;
      let tempItem = cart.find((item) => item.id === id);

      // 移除購物車商品
      if (event.target.classList.contains("remove-item-btn")) {
        this.removeItem(id);
        cartContent.removeChild(targetItem.parentElement.parentElement);

        // 購物車商品數量增加
      } else if (event.target.classList.contains("fa-plus")) {
        tempItem.quantity++;
        Storage.saveCart(cart);

        // 商品數量
        targetItem.parentElement.previousElementSibling.value =
          tempItem.quantity;

        // 商品小計
        let itemSubtotal = tempItem.quantity * tempItem.price;
        targetItem.parentElement.parentElement.parentElement.nextElementSibling.innerText =
          "$ " + itemSubtotal;

        // 購物車商品數量減少
      } else if (event.target.classList.contains("fa-minus")) {
        tempItem.quantity--;

        if (tempItem.quantity > 0) {
          Storage.saveCart(cart);
          // 商品數量
          targetItem.parentElement.nextElementSibling.value = tempItem.quantity;

          // 商品小計
          let itemSubtotal = tempItem.quantity * tempItem.price;
          targetItem.parentElement.parentElement.parentElement.nextElementSibling.innerText =
            "$ " + itemSubtotal;
        } else {
          this.removeItem(id);
          cartContent.removeChild(
            targetItem.parentElement.parentElement.parentElement.parentElement
          );
        }
      }

      this.setCartItemsAmount(cart);
      this.setOrderInformation(cart);
    });
  }

  // 移除購物車內的商品
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartItemsAmount(cart);
    Storage.saveCart();
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

  ui.setupApp();

  checkoutBtn.addEventListener("click", (event) => {
    cartDOM.classList.add("d-none");
    checkoutInfo.classList.remove("d-none");

    document.getElementById("step-1").classList.remove("active");
    document.getElementById("step-2").classList.add("active");
  });
});

let orderForms = document.querySelectorAll(".order-form");
Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
      } else {
        checkoutInfo.classList.add("d-none");
        orderDone.classList.remove("d-none");
        document.getElementById("step-2").classList.remove("active");
        document.getElementById("step-3").classList.add("active");
      }
    },
    false
  );
});
