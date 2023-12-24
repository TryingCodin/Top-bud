import { getButtonText } from "../helper/index.js";

export const createCard = (items = []) => {
  return items
    .map((item) => {
      return `<div class="catalog__item-wrap">
      <div class="catalog__item">
          <span class="catalog__item--title">${item.nazva}</span>
          <div class="catalog__item--img">
              <img src="./assets/images/products/${item.zobrazhennya}" alt="${
        item.nazva
      }">
          </div>
          <div class="row">
          <span>${item.cina} грн/${item.odinicya_vimiru}</span>
          <button type="button" class="btn" data-id='${
            item.nomer
          }'>${getButtonText(item.nomer)}</button>
          </div>
          <div class="catalog__item--descr" style="bottom: -25.8px">    
              <span>${item.nazva_kharakterystyky_1}: ${
        item.znachennya_kharakterystyky_1
      }</span>  
          </div>
      </div>
  </div>`;
    })
    .join("");
};
