import { findPath } from "../helper/index.js";

export function createSidebarMenu(data, store) {
  let menu = "";
  const path = findPath(data, store.category);
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      const toggle = category.toLowerCase() === path.grupi_1.toLowerCase();

      const classEl = store.category === category ? "category_active" : "";
      menu += `<button type="button" data-group="nazva_grupi_1" data-category="${category}" class="item ${classEl}">${category}</button>`;
      menu += createSubmenu(data[category], toggle, path, store);
    }
  }

  return menu;
}

function createSubmenu(data, toggle, path, store) {
  if (!data) return "";
  const classEl = toggle ? "list_show" : "";

  let menu = `<ul class='categories__list-first ${classEl}'>`;
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      const classEl = store.category === category ? "category_active" : "";
      const toggle = category.toLowerCase() === path.grupi_2.toLowerCase();
      menu += `<li data-group="nazva_grupi_2" data-category="${category}" class="item ${classEl}"><span>${category}</span></li>`;

      menu += "</li>";
      menu += createBottomMenu(data[category], toggle, store);
    }
  }
  menu += "</ul>";
  return menu;
}

function createBottomMenu(items, toggle, store) {
  if (!items || items.length === 0) {
    return "";
  }
  const classEl = toggle ? "list_show" : "";
  let menu = `<li><ul class="categories__list-second ${classEl}">`;
  items.forEach((item) => {
    const classEl = store.category === item ? "category_active" : "";
    menu += `<li data-group="nazva_grupi_3" data-category="${item}" class="item ${classEl}"><span>${item}</span></li>`;
  });
  menu += "</ul></li>";
  return menu;
}
