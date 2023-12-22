import { filteringOptions } from "../helper/index.js";

export function createListCharacteristics(data) {
  let menu = "";
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      menu += "<div>";
      menu += `<span class="filter__characteristics-title">${category}:</span>`;
      menu += createList(data[category], category);
      menu += "</div>";
    }
  }
  return menu;
}

function createList(items = [], name) {
  if (!items || items.length === 0) {
    return "";
  }

  const [names, values] = filteringOptions();

  let menu = "<ul class='filter__characteristics-list'>";

  items.forEach((item, index) => {
    const toggle =
      names.includes(name?.toUpperCase()) && values.includes(item.toString());
    const hiddenClass = index < 5 ? "expanded" : "";
    menu += `<li class='${hiddenClass}'>
    <label><input type="checkbox" name="${name}" value="${item}" ${
      toggle ? "checked" : ""
    }>${item}</label>
    </li>`;
  });
  menu +=
    items.length > 5
      ? `<li class="show-more expanded">Показати більше</li>`
      : "";
  menu += "</ul>";
  return menu;
}
