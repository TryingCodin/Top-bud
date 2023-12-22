export const createCard = (items = []) => {
  return items
    .map((item) => {
      return `<div class="catalog__item-wrap" data-id='${item.nomer}'>
      <div class="catalog__item">
          <span class="catalog__item--title">${item.nazva}</span>
          <div class="catalog__item--img">
              <img src="./assets/images/products/${item.zobrazhennya}" alt="${item.nazva}">
          </div>
          <span>${item.cina} грн/${item.odinicya_vimiru}</span>
          <div class="catalog__item--descr" style="bottom: -25.8px">
              <span>${item.nazva_kharakterystyky_1}: ${item.znachennya_kharakterystyky_1}</span>
          </div>
      </div>
  </div>`;
    })
    .join("");
};
