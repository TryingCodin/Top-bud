import { createBasket } from "./markup/basket.js";
import { tbodyEl, cartTotalEl } from "./refs.js";
import { getFromLocalStorage, addToLocalStorage } from "./api/localstorage.js";
import { updateMarkup } from "./helper/index.js";

async function onLoad() {
  try {
    const response = getFromLocalStorage();
    if (!response.length) return;
    const markup = createBasket(response);
    updateMarkup(tbodyEl, markup);
    updateCartPrice();
  } catch ({ message }) {
    console.log(message);
  }
}

onLoad();

function getPrice() {
  const response = getFromLocalStorage();
  return response.reduce((acc, item) => {
    return acc + item.cina * item.count;
  }, 0);
}

function updateCartPrice() {
  const total = getPrice();
  cartTotalEl[0].textContent = total + " грн.";
  cartTotalEl[1].textContent = total + " грн.";
}

function getDataCard(el) {
  const rowEl = el.closest(".table-row");
  const id = rowEl.dataset.id;
  return { rowEl, id };
}

tbodyEl.addEventListener("click", deleteProduct);
tbodyEl.addEventListener("click", addProduct);
tbodyEl.addEventListener("click", removeProduct);
tbodyEl.addEventListener("input", onInput);

function deleteProduct(e) {
  if (!e.target.classList.contains("delete")) return;

  const { rowEl, id } = getDataCard(e.target);
  const items = getFromLocalStorage().filter(
    ({ nomer }) => nomer.toString() !== id
  );
  addToLocalStorage(items);
  rowEl.remove();
  updateCartPrice();
}

function addProduct(e) {
  if (!e.target.classList.contains("incriment")) return;
  updateListProducts(e.target, +1);
}

function removeProduct(e) {
  if (!e.target.classList.contains("decrement")) return;
  updateListProducts(e.target, -1);
}

function updateListProducts(el, value) {
  const { rowEl, id } = getDataCard(el);
  const items = getFromLocalStorage();
  const obj = items.find(({ nomer }) => nomer.toString() === id);
  obj.count = Number(obj.count);
  obj.count += value;
  addToLocalStorage(items);
  updateDateCard(rowEl, obj);
  rowEl.setAttribute("data-count", obj.count);
  updateCartPrice();
}

function updateDateCard(el, obj) {
  el.querySelector("input").value = obj.count;
  const total = obj.count * obj.cina;
  el.querySelector(".total").textContent = total + " грн.";
}

function onInput(e) {
  const { rowEl, id } = getDataCard(e.target);
  const items = getFromLocalStorage();
  const obj = items.find(({ nomer }) => nomer.toString() === id);
  obj.count = e.target.value;
  addToLocalStorage(items);
  updateDateCard(rowEl, obj);
  rowEl.setAttribute("data-count", obj.count);
  updateCartPrice();
}

window.addEventListener("beforeunload", function (e) {
  const items = getFromLocalStorage().filter(({ count }) => count > 0);
  addToLocalStorage(items);
});
