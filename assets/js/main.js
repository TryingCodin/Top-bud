import { getData } from "./api/api.js";
import { createProductList } from "./markup/product-list.js";
import { assortmentGridEl } from "./refs.js";
import { getMenuStructure, addMarkup, createADataObj } from "./helper/index.js";
import { saveDataToSectionStore } from "./api/sectionstore.js";

async function onLoad() {
  try {
    const response = await getData();
    const data = getMenuStructure(response);
    const htmlMenu = createProductList(data);
    addMarkup(assortmentGridEl, htmlMenu, "beforeend");
  } catch ({ message }) {
    console.log(message);
  }
}

onLoad();

assortmentGridEl.addEventListener("click", (e) => {
  if (!e.target.classList.contains("item")) return;
  const { group, category } = e.target.dataset;
  const data = createADataObj(group, category);
  console.log(data);
  saveDataToSectionStore(data);
});

const swiper = new Swiper(".banner__swiper", {
  slidesPerView: 1,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 2500,
  },
});
