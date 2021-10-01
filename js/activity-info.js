const loading = document.querySelector(".spinner");
const cartItemsAmount = document.querySelector(".cart-items-amount");
const activityTop = document.querySelector(".activity-top");
const activityContent = document.querySelector(".activity-intro");
const trafficInfo = document.querySelector(".traffic-info p");

let cart = [];
let favoriteList = [];
let activityData = {};

class Activities {
  async getActivityInfo() {
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const id = url.searchParams.get("id");

    try {
      let response = await fetch(
        "https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvSuggestTravel.aspx?$filter=ID+like+" +
          id
      );
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
    favoriteList = Storage.getFavorite();
  }

  // 渲染活動資訊頁面
  showActivityInfo(activity) {
    const activityInfoData = {
      dayTravel: [activity[0].FirstDayTravel],
      dayFeature: [activity[0].FirstDayFeature],
    };

    // 根據活動的天數不同渲染不同的內容
    switch (activity[0].TravelDays) {
      case "2天":
        activityInfoData.dayTravel.push(activity[0].SecondDayTravel);
        activityInfoData.dayFeature.push(activity[0].SecondDayFeature);
        break;

      case "3天":
        activityInfoData.dayTravel.push(
          activity[0].SecondDayTravel,
          activity[0].ThirdDayTravel
        );
        activityInfoData.dayFeature.push(
          activity[0].SecondDayFeature,
          activity[0].ThirdDayFeature
        );
        break;

      case "半天":
      case "1天":
      default:
        break;
    }

    // 活動簡介
    activityTop.innerHTML = `<h2 class="activity-title fs-1 fw-bold px-3 my-4 lh-sm">${activity[0].Name}</h2>
                    <p class="lh-base mb-3 fs-5">${activity[0].MovingIntroduction}</p>
                    <div class="d-flex justify-content-between flex-column flex-sm-row">
                        <p class="lh-base mb-3 fs-5"><i class="fas fa-map-marker-alt text-danger me-1"></i>
                            地點：${activity[0].City} ${activity[0].Town}</p>
                        <button type="button" class="add-to-favorite-btn rounded-pill fw-bold" data-id="${activity[0].ID}"><i
                                class="far fa-heart me-2 fw-bold"></i>加入收藏</button>
                    </div>`;

    // 活動介紹
    let result = "";
    for (let i = 0; i < activityInfoData.dayTravel.length; i++) {
      result += `<div class="day d-flex flex-column">
    <span class="fs-3 fw-bold py-2 mb-3 d-inline-block align-self-center">Day${
      i + 1
    }</span>
    <table class="mb-3">
        <tr>
            <td class="pe-3"><span class="fs-4 badge rounded-pill bg-warning text-dark mb-3">行程</span>
            </td>
            <td><p class="lh-base mb-3 fs-5">${
              activityInfoData.dayTravel[i]
            }</p></td>
        </tr>
        <tr>
            <td class="pe-3"><span class="fs-4 badge rounded-pill bg-warning text-dark mb-3">特色</span>
            </td>
            <td><p class="lh-base fs-5">${activityInfoData.dayFeature[i]}</p>
            </td>
        </tr>
    </table>
</div>`;
    }
    activityContent.innerHTML = result;

    // 交通資訊
    trafficInfo.innerText = `${activity[0].TrafficGuidelines || "無詳細資訊"}`;

    const addToFavoriteBtn = document.querySelector(".add-to-favorite-btn");
    let inFavoriteList = favoriteList.find(
      (item) => activity[0].ID === item.id
    );
    if (inFavoriteList) {
      addToFavoriteBtn.classList.add("active");
      addToFavoriteBtn.innerHTML = `<i class="far fa-heart me-2 fw-bold"></i>已加入收藏`;
    }

    this.getFavoriteBtn(activity);
  }

  // 監聽收藏按鈕
  getFavoriteBtn(activity) {
    const addToFavoriteBtn = document.querySelector(".add-to-favorite-btn");
    addToFavoriteBtn.addEventListener("click", (event) => {
      const favoriteItem = {
        id: activity[0].ID,
        Name: activity[0].Name,
      };

      let inFavoriteList = favoriteList.find(
        (item) => event.target.dataset.id === item.id
      );

      if (inFavoriteList) {
        // 取消收藏
        this.removeFavoriteItem(event.target.dataset.id);
        addToFavoriteBtn.classList.remove("active");
        addToFavoriteBtn.innerHTML = `<i class="far fa-heart me-2 fw-bold"></i>加入收藏`;
      } else {
        // 加入收藏
        addToFavoriteBtn.classList.add("active");
        addToFavoriteBtn.innerHTML = `<i class="far fa-heart me-2 fw-bold"></i>已加入收藏`;
        favoriteList = [...favoriteList, favoriteItem];
        Storage.saveFavorite(favoriteList);
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
  const activities = new Activities();

  ui.setupApp();

  activities.getActivityInfo().then((activity) => {
    loading.classList.add("d-none");
    ui.showActivityInfo(activity);
  });
});
