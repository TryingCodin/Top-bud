import { getData } from "./api/api.js";
import { createCard } from "./markup/card.js";
import { createSidebarMenu } from "./markup/sidebar-menu.js";
import { createListCharacteristics } from "./markup/list-characteristics.js";
import {
  catalogGridEl,
  sortSelectEl,
  catalogSidebarEl,
  sidebarFilterEl,
} from "./refs.js";
import {
  filteredData,
  updateMarkup,
  createADataObj,
  getMenuStructure,
  getCharacteristicsFilters,
  filterDataByCharacteristics,
} from "./helper/index.js";
import {
  getDataFromStorage,
  saveDataToSectionStore,
  getDataFromSectionStore,
} from "./api/sectionstore.js";

const FILTER_KEY = "filtering-options";
let response = "";
let menuData = "";
let sortType = null;
let store = null;

async function onLoad() {
  try {
    store = getDataFromSectionStore();

    if (!store) {
      return;
    }
    response = await getData();
    menuData = getMenuStructure(response);
    updatePage();
  } catch ({ message }) {
    console.log(message);
  }
}

onLoad();

function updatePage() {
  const htmlMenu = createSidebarMenu(menuData, store);
  let filData = filteredData(response, store);
  const sortData = sortProducts(filData, sortType);
  const characteristics = getCharacteristicsFilters(sortData);
  const htmlCharacteristics = createListCharacteristics(characteristics);
  const htmlGeller = createCard(filterDataByCharacteristics(sortData));
  updateMarkup(sidebarFilterEl, htmlCharacteristics);
  updateMarkup(catalogGridEl, htmlGeller);
  updateMarkup(catalogSidebarEl, htmlMenu);
}

sortSelectEl.addEventListener("change", onChange);
catalogSidebarEl.addEventListener("click", onClick);

function onChange(e) {
  sortType = e.target.value;
  updatePage();
}

function onClick(e) {
  const liEl = e.target.closest(".item");
  if (!liEl) return;
  const { group, category } = liEl.dataset;
  const data = createADataObj(group, category);
  saveDataToSectionStore(data);
  onLoad();
}

sidebarFilterEl.addEventListener("change", (e) => {
  const data = [
    ...e.currentTarget.querySelectorAll('input[type="checkbox"]:checked'),
  ].map((item) => {
    return {
      name: item.name,
      value: item.value,
    };
  });

  saveDataToSectionStore(data, FILTER_KEY);
  updatePage();
});

sidebarFilterEl.addEventListener("click", function (event) {
  if (!event.target.classList.contains("show-more")) return;

  const button = event.target;
  const listItems = button.parentNode.querySelectorAll("li");
  const isExpanded = button.getAttribute("data-expanded") === "true";

  listItems.forEach((item, index) => {
    if (index >= 5) item.classList.toggle("expanded");
  });

  button.textContent = isExpanded ? "Показати більше" : "Приховати";
  button.setAttribute("data-expanded", !isExpanded);
  button.classList.toggle("expanded");
});

function sortProducts(products, sortType) {
  const sortedProducts = [...products];

  switch (sortType) {
    case "name-asc":
      return sortedProducts.sort((a, b) =>
        a["nazva"].localeCompare(b["nazva"])
      );
    case "name-desc":
      return sortedProducts.sort((a, b) =>
        b["nazva"].localeCompare(a["nazva"])
      );
    case "price-asc":
      return sortedProducts.sort(
        (a, b) => parseFloat(a["cina"]) - parseFloat(b["cina"])
      );
    case "price-desc":
      return sortedProducts.sort(
        (a, b) => parseFloat(b["cina"]) - parseFloat(a["cina"])
      );
    default:
      return sortedProducts.sort(
        (a, b) => parseFloat(a["nomer"]) - parseFloat(b["nomer"])
      );
  }
}
