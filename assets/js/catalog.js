import { getData } from "./api/api.js";
import { createCard } from "./markup/card.js";
import { createSidebarMenu } from "./markup/sidebar-menu.js";
import { createListCharacteristics } from "./markup/list-characteristics.js";
import {
  enscartEl,
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

import {
  setToLocalStorage,
  getFromLocalStorage,
  addToLocalStorage,
} from "./api/localstorage.js";
import { BTN_TEXT_ADD_PRODUCT, BTN_TEXT_DELETE_PRODUCT } from "./var.js";

import { sortProducts } from "./helper/sort.js";

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

catalogGridEl.addEventListener("click", updateYourCart);

function updateYourCart(e) {
  if (!e.target.classList.contains("btn")) return;
  const id = e.target.dataset.id;
  let products = getFromLocalStorage();
  const product = products.find((item) => item.nomer.toString() === id);
  let text = BTN_TEXT_ADD_PRODUCT;
  if (product) {
    products = products.filter((item) => item.nomer.toString() !== id);
  } else {
    const product = response.find((item) => item.nomer.toString() === id);
    products.push({ ...product, count: 1 });
    text = BTN_TEXT_DELETE_PRODUCT;
  }
  e.target.textContent = text;
  addToLocalStorage(products);
  toggleEnscart();
}

function toggleEnscart() {
  let products = getFromLocalStorage();
  const method = products.length ? "remove" : "add";
  enscartEl.classList[method]("is-hidden");
  const total = products.reduce((acc, item) => {
    return acc + Number(item.count);
  }, 0);
  enscartEl.children[0].setAttribute("data-count", products.length);
}
toggleEnscart();
