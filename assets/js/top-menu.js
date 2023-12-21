import { getData } from "./api/api.js";
import { createMenu } from "./markup/menu.js";
import { menuCatalogEl, menuNavEl } from "./refs.js";
import { getMenuStructure, addMarkup, createADataObj } from "./helper/index.js";
import { saveDataToSectionStore } from "./api/sectionstore.js";

async function onLoad() {
  try {
    const response = await getData();
    const data = getMenuStructure(response);
    const htmlMenu = createMenu(data);
    addMarkup(menuCatalogEl, htmlMenu);
  } catch ({ message }) {
    console.log(message);
  }
}

onLoad();

menuNavEl.addEventListener("click", (e) => {
  if (!e.target.classList.contains("item")) return;
  const { group, category } = e.target.dataset;
  const data = createADataObj(group, category);
  saveDataToSectionStore(data);
});
