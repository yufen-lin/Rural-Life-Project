const cartItemsAmount = document.querySelector(".cart-items-amount");
let cart = [];

class UI {
  setupApp() {
    cart = Storage.getCart();
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
}

class Storage {
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.setupApp();
});
