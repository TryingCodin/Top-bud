export const createBasket = (items = []) => {
  return items
    .map((item) => {
      return ` <tr class="table-row" data-id='${item.nomer}' data-count="${
        item.count
      }">
      <td class="image">
          <img src="./assets/images/products/${item.zobrazhennya}"
              alt="${item.zobrazhennya}" title="${item.zobrazhennya}">
      </td>
      <td class="name">
          <div class="image"> 
              <img src="./assets/images/products/${item.zobrazhennya}"
                  alt="${item.zobrazhennya}">
          </div>
          <p>${item.nazva}</p>
      </td>
      <td class="quantity">
          <div class="input-group btn-block">

              <button class="btn btn-primary decrement" type="button">
                &ndash;
              </button>

              <input class="form-control" type="number" value="${item.count}">

              <button class="btn btn-primary incriment" type="button">
                &plus;
              </button>
              <button class="btn btn-danger delete" type="button">
                  &times;
              </button>

          </div>
      </td>
      <td class="price">${item.cina} грн</td>
      <td class="total">${item.cina * item.count} грн</td>
  </tr>`;
    })
    .join("");
};
