const cartItemsAmount = document.querySelector(".cart-items-amount");
const favorite = document.querySelector(".favorite-list .row");

let cart = [];
let favoriteList = [];
let removeBtnDOM = [];

class UI {
  setupApp() {
    cart = Storage.getCart();
    this.setCartItemsAmount(cart);
    favoriteList = Storage.getFavorite();
    this.displayFavoriteList(favoriteList);
    this.favoriteListLogic();
  }

  // 將收藏清單渲染於畫面上
  displayFavoriteList(favoriteList) {
    let result = "";
    if (favoriteList.length === 0) {
      result = `<div class="d-flex flex-column justify-content-center align-items-center py-5">
                                <p class="fs-4 text-center mb-3">目前尚無任何收藏</p>
                                <a href="activities.html" class="btn activity-btn mt-3" type="button">Go！去找活動吧<i
                                        class="fas fa-arrow-right ms-2"></i>
                                </a>
                            </div>`;
    } else {
      favoriteList.forEach((item) => {
        result += `<div class="col-12 col-md-6 col-lg-4">
        <li class="px-3 py-3 mb-4 bg-light d-flex flex-column align-items-center">
            <h2 class="fs-6 pb-3 lh-base "><i class="fas fa-tag me-2"></i>${item.Name}</h2>
            <div class="ps-4">
                <a href="#" class="d-inline-block more-link me-3 px-2 py-2 border bg-white text-dark rounded"
                    data-id="${item.id}">詳細資訊</a>
                <a href="#" class="d-inline-block delete-link me-3 px-2 py-2 border bg-white text-dark rounded"
                    data-id="${item.id}">取消收藏</a>
            </div>
        </li>
    </div>`;
      });
    }
    favorite.innerHTML = result;
  }

  // 處理收藏清單的行為
  favoriteListLogic() {
    favorite.addEventListener("click", (event) => {
      if (event.target.classList.contains("more-link")) {
        let id = event.target.dataset.id;
        event.target.setAttribute("href", "activity-info.html?id=" + id);
      } else if (event.target.classList.contains("delete-link")) {
        let removeItemID = event.target.dataset.id;
        this.removeFavoriteItem(removeItemID);
        favorite.removeChild(
          event.target.parentElement.parentElement.parentElement
        );
      }
    });
  }

  // 將收藏從清單中移除
  removeFavoriteItem(id) {
    favoriteList = favoriteList.filter((item) => item.id !== id);
    Storage.saveFavorite(favoriteList);
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

  static saveFavorite() {
    localStorage.setItem("favorite", JSON.stringify(favoriteList));
  }

  static getFavorite() {
    return localStorage.getItem("favorite")
      ? JSON.parse(localStorage.getItem("favorite"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.setupApp();
});
