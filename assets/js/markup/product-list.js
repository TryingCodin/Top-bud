const images = {
  1: "icon__rolled-metal.svg",
  2: "icon__stainless-steel.svg",
  3: "icon__non-ferrous-metal.svg",
  4: "icon__wood-based-materials.svg",
};

export function createProductList(data) {
  let menu = "";
  let index = 1;
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      menu += `<div class='assortment__item item${index}'>
      <div class="assortment__item-title">
          <img src="./assets/images/icons/${images[index]}" alt="${category}" title="${category}">
          <h3>${category}</h3>
      </div>`;
      menu += createSubmenu(data[category]);
      menu += "</div>";
      index += 1;
    }
  }

  return menu;
}

function createSubmenu(data) {
  if (!data) return "";
  let menu = "<ul>";
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      const toggle = !!data[category]?.length;
      const classEl = toggle ? "dropdown-chevron" : "";
      menu += `<li class="assortment__item--dropdown">
      <a href="catalog.html" class="${classEl} item" data-group="nazva_grupi_2" data-category="${category}">${category}</a>`;
      if (toggle)
        menu += '<button class="assortment__item--dropdown-btn"></button>';
      menu += createBottomMenu(data[category]);
      menu += "</li>";
    }
  }
  menu += "</ul>";
  return menu;
}

function createBottomMenu(items) {
  if (!items || items.length === 0) {
    return "";
  }
  let menu = "<ul class='assortment__item--dropdown-list'>";
  items.forEach((item) => {
    menu += `<li><a href="catalog.html" data-group="nazva_grupi_3" data-category="${item}" class="item">${item}</a></li>`;
  });
  menu += "</ul>";
  return menu;
}
