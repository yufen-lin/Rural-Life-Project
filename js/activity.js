const loading = document.querySelector(".spinner");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const allActivitiesBtn = document.querySelector(".all-activity-btn");
const activitiesDOM = document.querySelector(".activities-list");
const cartDOM = document.querySelector(".cart");
const cartItemsAmount = document.querySelector(".cart-items-amount");
const pagination = document.querySelector(".pagination");

let cart = [];
let favoriteList = [];
let jsonData = [];

class Activities {
  async getActivities() {
    try {
      let response = await fetch(
        "https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvSuggestTravel.aspx"
      );
      let data = await response.json();
      jsonData = data;
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

  displayActivities(activities) {
    let result = "";
    if (activities.length === 0) {
      result = `<div class="bg-light p-4 mt-4">
                    <p class="fs-4 text-center lh-base py-4">查無相關的體驗活動<i class="far fa-frown ms-2"></i>
                        <br>要不要換個地方呢？
                    </p>
                </div>`;
    } else {
      activities.forEach((activity, index) => {
        result += `<div class="col-md-6 mb-3">
                            <li class="card border-start-0 shadow-sm">
                                <div class="card-body activity-card rounded-3 p-4 pb-3">
                                    <h2 class="card-title fs-4 lh-base">${activity.Name}</h2>
                                    <p class="card-text lh-base">
                                        ${activity.MovingIntroduction}
                                    </p>
                                    <div class="d-flex justify-content-between align-items-center mt-2">
                                        <div class="activity-tag">
                                            <span class="badge rounded-pill tag fs-6">${activity.TravelDays}</span><span
                                                class="badge rounded-pill tag fs-6">${activity.City}</span>
                                        </div>
                                        <a href="#" class="more-link-btn" data-id=${index}>( More )</a>
                                    </div>
                                </div>
                            </li>
                        </div>`;
      });
    }

    activitiesDOM.innerHTML = result;
    this.getActivityButton();

    allActivitiesBtn.addEventListener("click", (event) => {
      this.pagination(jsonData, 1);
    });
  }

  searchActivities(activities) {
    const performSearch = () => {
      const keyword = searchInput.value.trim().replace(/台/g, "臺");
      if (!keyword) return;

      const result = activities.filter(
        (activity) =>
          activity.City.includes(keyword) ||
          activity.TravelDays.includes(keyword)
      );

      this.pagination(result, 1);
      searchInput.value = "";
    };

    searchBtn.addEventListener("click", (event) => {
      performSearch();
    });

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.isComposing) {
        event.preventDefault();
        performSearch();
      }
    });
  }

  pagination(activityData, nowPage) {
    const dataTotal = activityData.length;
    const perPage = 18;
    const pageTotal = Math.ceil(dataTotal / perPage);

    let currentPage = nowPage;
    if (currentPage > pageTotal) {
      currentPage = pageTotal;
    }
    const minData = currentPage * perPage - perPage + 1;
    const maxData = currentPage * perPage;

    const dataPerPage = [];
    activityData.forEach((item, index) => {
      const num = index + 1;
      if (num >= minData && num <= maxData) {
        dataPerPage.push(item);
      }
    });

    const page = {
      pageTotal,
      currentPage,
      hasPrev: currentPage > 1,
      hasNext: currentPage < pageTotal,
    };

    this.displayActivities(dataPerPage);
    this.pageBtn(page);
  }

  pageBtn(page) {
    let str = "";
    const total = page.pageTotal;

    // 如果前面還有頁數(不是第一頁)，箭頭就要可以按(連向前一頁)
    if (page.hasPrev) {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${
        Number(page.currentPage) - 1
      }">&laquo;</a></li>`;
    } else {
      str += `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;
    }

    // 當前頁面添加 active class
    for (let i = 1; i <= total; i++) {
      if (Number(page.currentPage) === i) {
        str += `<li class="page-item active"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      } else {
        str += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
      }
    }

    // 如果後面還有頁數(不是最後一頁)，箭頭就要可以按(連向後一頁)
    if (page.hasNext) {
      str += `<li class="page-item"><a class="page-link" href="#" data-page="${
        Number(page.currentPage) + 1
      }">&raquo;</a></li>`;
    } else {
      str += `<li class="page-item disabled"><span class="page-link">&raquo;</span></li>`;
    }

    pagination.innerHTML = str;
  }

  switchPage(e) {
    if (e.target.nodeName !== "A") return;
    const page = e.target.dataset.page;
    this.pagination(jsonData, page);
  }

  getActivityButton() {
    const buttons = [...document.querySelectorAll(".more-link-btn")];
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        let id = event.target.dataset.id;
        button.setAttribute("href", "activity-info.html?id=" + id);
      });
    });
  }

  removeFavoriteItem(id) {
    favoriteList = favoriteList.filter((item) => item.id !== id);
    console.log(favoriteList);
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
  const activities = new Activities();

  ui.setupApp();

  activities.getActivities().then((activities) => {
    loading.classList.add("d-none");
    ui.pagination(activities, 1);
    ui.searchActivities(jsonData);
    pagination.addEventListener("click", ui.switchPage.bind(ui));
  });
});
