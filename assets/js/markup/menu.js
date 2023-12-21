export function createMenu(data) {
  let menu = "<ul class='header__menu--list-dropdown-first'>";
  menu += '<li><button class="close-menu"></button></li>';
  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      menu += `<li class="header__menu--list-dropdown-item">
          <a href="catalog.html" class="dropdown-chevron item" data-group="nazva_grupi_1" data-category="${category}">
          ${category}
          </a>
          <button class="next-btn--first"></button>`;
      menu += createSubmenu(data[category]);
      menu += "</li>";
    }
  }
  menu += "</ul>";

  return menu;
}

function createSubmenu(data) {
  if (!data) return "";
  let menu = '<ul class="header__menu--list-dropdown-second">';

  for (let category in data) {
    if (data.hasOwnProperty(category)) {
      const toggle = !!data[category]?.length;
      const classEl = toggle ? "dropdown-chevron" : "";
      menu += ` <li class="header__menu--list-dropdown-item">
        <a href="catalog.html" class="${classEl} item"
        data-group="nazva_grupi_2" data-category="${category}">
            ${category}
        </a>`;
      if (toggle) menu += '<button class="next-btn--third"></button>';
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
  let menu = "<ul class='header__menu--list-dropdown-third'>";
  items.forEach((item) => {
    menu += `<li>
      <a href="catalog.html" data-group="nazva_grupi_3" data-category="${item}" class="item">
          ${item}
      </a>
  </li>`;
  });
  menu += '<li class="back-btn"><button class="back-btn--third"></button></li>';
  menu += "</ul>";

  return menu;
}
