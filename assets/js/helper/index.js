import { getDataFromStorage } from "../api/sectionstore.js";
import { getFromLocalStorage } from "../api/localstorage.js";
import { BTN_TEXT_ADD_PRODUCT, BTN_TEXT_DELETE_PRODUCT } from "../var.js";

const FILTER_KEY = "filtering-options";

export function getMenuStructure(data) {
  const obj = {};
  data.forEach((item) => {
    const {
      nazva_grupi_1: key,
      nazva_grupi_2: key2,
      nazva_grupi_3: key3,
    } = item;

    if (!obj[key]) obj[key] = {};
    if (!obj[key][key2]) obj[key][key2] = [];
    if (key3) {
      if (!obj[key][key2].includes(key3)) obj[key][key2].push(key3);
    }
  });
  return obj;
}

export function addMarkup(el, markup = "", position = "afterend") {
  el.insertAdjacentHTML(position, markup);
}

export const updateMarkup = (el, markup = "") => {
  el.innerHTML = markup;
};

export function createADataObj(group, category) {
  return { group, category };
}

export function findPath(obj, targetString) {
  for (const key in obj) {
    let path = { grupi_1: "", grupi_2: "", grupi_3: "" };
    path.grupi_1 = key;

    if (key.toLowerCase() === targetString.toLowerCase()) {
      return path;
    }
    if (typeof obj[key] === "object") {
      for (const key2 in obj[key]) {
        path.grupi_2 = key2;
        if (key2.toLowerCase() === targetString.toLowerCase()) {
          return path;
        }
        if (obj[key][key2]?.includes(targetString)) {
          path.grupi_3 = targetString;
          return path;
        }
      }
    }
  }
  return null;
}

const key1 = "nazva_kharakterystyky_1";
const characteristic1 = "znachennya_kharakterystyky_1";

const key2 = "nazva_kharakterystyky_2";
const characteristic2 = "znachennya_kharakterystyky_2";

export function getCharacteristicsFilters(items = []) {
  return items.reduce((acc, item) => {
    if (key1 in item) {
      acc = getCharacteristics(acc, item, key1, characteristic1);
    }
    if (key2 in item) {
      acc = getCharacteristics(acc, item, key2, characteristic2);
    }
    return acc;
  }, {});
}

function getCharacteristics(acc, item, key, characteristic) {
  if (!acc[item[key]]) {
    acc[item[key]] = [item[characteristic]];
  } else {
    if (!acc[item[key]].includes(item[characteristic]))
      acc[item[key]].push(item[characteristic]);
  }
  return acc;
}

export function filteredData(items = [], data) {
  return items.filter((item) => {
    return item[data.group]?.toLowerCase() === data.category.toLowerCase();
  });
}

export function filterDataByCharacteristics(items = []) {
  const [names, values] = filteringOptions();
  if (!names.length) return items;
  return items.filter((item) => {
    return (
      (names.includes(item[key1]?.toUpperCase()) &&
        values.includes(item[characteristic1].toString())) ||
      (names.includes(item[key2]?.toUpperCase()) &&
        values.includes(item[characteristic2].toString()))
    );
  });
}

export function filteringOptions() {
  const data = getDataFromStorage(FILTER_KEY);
  const names = data.map(({ name }) => name?.toUpperCase());
  const values = data.map(({ value }) => value?.toString());
  return [names, values];
}

export function getButtonText(id) {
  const items = getFromLocalStorage().map(({ nomer }) => nomer.toString());
  return items.includes(id.toString())
    ? BTN_TEXT_DELETE_PRODUCT
    : BTN_TEXT_ADD_PRODUCT;
}
