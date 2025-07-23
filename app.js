//eğer sayfada jQuery yoksa CDN'den ekle
(function () {
  if (typeof window.jQuery === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    script.onload = function () {
      mainUserListApp();
    };
    document.head.appendChild(script);
  } else {
    mainUserListApp();
  }
})();

function mainUserListApp() {
  /* eslint-disable */
  (($) => {
    'use strict';

    const classes = {
      style: 'userlist-style',
      container: 'container',
      title: 'title',
      userList: 'user-list',
      userCard: 'user-card',
      cardHeader: 'card-header',
      cardBody: 'card-body',
      cardMainInfo: 'card-main-info',
      cardAdress: 'card-address',
      cardFooter: 'card-footer',
      deleteBtn: 'delete-btn',
    };

    const selectors = {
      style: `.${classes.style}`,
      container: `.${classes.container}`,
      title: `.${classes.title}`,
      userList: `.${classes.userList}`,
      userCard: `.${classes.userCard}`,
      cardHeader: `.${classes.cardHeader}`,
      cardBody: `.${classes.cardBody},`,
      cardMainInfo: `.${classes.cardMainInfo}`,
      cardAdress: `.${classes.cardAdress}`,
      cardFooter: `.${classes.cardFooter}`,
      deleteBtn: `.${classes.deleteBtn}`,
      appendLocation: '.ins-api-users',
    };

    const API_URL = 'https://jsonplaceholder.typicode.com/users';
    const STORAGE_KEY = 'userListData';
    const CACHE_DURATION = 15 * 1000; //BURAYI 1 GÜNE DEĞİŞTİRMEYİ UNUTMAAAA!!!!

    const self = {};

    self.init = () => {
      self.reset();
      self.buildCSS();
      self.buildHTML();
      self.checkAndLoadData();
      self.setEvents();
    };

    self.reset = () => {
      $(selectors.style).remove();
      $(selectors.container).remove();
      $(document).off('.userDeleteEvent');
    };

    self.buildCSS = () => {
      const customStyle = `
              <style class="${classes.style}">
              </style>
          `;
      $('head').append(customStyle);
    };

    self.buildHTML = () => {
      const html = `
        <div class="${classes.container}">
            <h1 class="${classes.title}">User List</h1>
        </div>
      `;
      $(selectors.appendLocation).prepend(html);
    };

    self.setEvents = () => {
      $(document).on(`click.userDeleteEvent`, selectors.deleteBtn, function () {
        const $id = Number($(this).data('id'));
        self.deleteUser($id);
      });
    };

    //localde varsa getir. yoksa apiden çek
    self.checkAndLoadData = () => {
      let users = self.getFromStorage();
      if (users) {
        self.renderList(users);
      } else {
        //api fetch
        fetch(API_URL)
          .then((respond) => {
            //bunu ekledim çünkü daha önce ağzım yandı bundan
            //fetch sadece network hatalarında reject ediyor. bu yüzden sunucudan 4xx, 5xx gibi yanıtlar dönerse burda yakalıyorum
            if (!respond.ok) throw new Error('API respond failed');
            return respond.json();
          })
          .then((data) => {
            self.saveToStorage(data);
            self.renderList(data);
          })
          .catch((err) => {
            console.error('api error: ', err);
          });
      }
    };

    //parametre olarak gelen user datasıyla card oluştur
    self.renderList = (users) => {
      const $oldList = $(`${selectors.userList}`);
      $oldList.remove();
      const $container = $(selectors.container);
      const $userList = $(`<div class="${classes.userList}"></div>`);

      $.each(users, function (index, user) {
        const $card = $(`<div class=${classes.userCard}></div>`);

        const $cardHeader = $(`<div class=${classes.cardHeader}></div>`);
        const $h2 = $(`<h2>${user.name}</h2>`);
        $cardHeader.append($h2);
        $card.append($cardHeader);

        const $cardBody = $(`<div class=${classes.cardBody}>`);

        const $cardMainInfo = $(`<div class=${classes.cardMainInfo}>`);
        $cardMainInfo.append(`<p>${user.username}</p>`);
        $cardMainInfo.append(`<p>${user.email}</p>`);
        $cardBody.append($cardMainInfo);

        const $cardAddress = $(`<div class=${classes.cardAdress}>`);
        $cardAddress.append(`<p>${user.address.city}</p>`);
        $cardAddress.append(`<p>${user.address.street}</p>`);
        $cardAddress.append(`<p>${user.address.suite}</p>`);
        $cardAddress.append(`<p>${user.address.zipcode}</p>`);
        $cardBody.append($cardAddress);

        $card.append($cardBody);

        const $cardFooter = $(`<div class=${classes.cardFooter}></div>`);
        $cardFooter.append(
          `<button class=${classes.deleteBtn} data-id=${user.id}>Delete</button>`
        );
        $card.append($cardFooter);

        $userList.append($card);
      });

      $container.append($userList);
    };

    self.deleteUser = (id) => {
      let $users = self.getFromStorage();

      if (!$users) return;

      $users = $users.filter((item) => item.id !== id);

      self.saveToStorage($users);
      self.renderList($users);
    };

    //LOCALSTORAGE İŞLEMLERİ
    //locale kaydetme
    self.saveToStorage = (data) => {
      const toStore = {
        users: data,
        exp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    };

    //localden çekme
    self.getFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      try {
        const parsed = JSON.parse(stored);

        if (!parsed.exp || !parsed.users) return null;

        if (Date.now() - parsed.exp > CACHE_DURATION) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }

        return parsed.users;
      } catch {
        return null;
      }
    };

    $(document).ready(self.init);
  })(jQuery);
}
