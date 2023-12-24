const STORAGE_KEY = "products-list";

export function setToLocalStorage(product) {
  const localArr = getFromLocalStorage();
  localArr.push(product);
  addToLocalStorage(localArr);
}

export function getFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error.message);
  }
}

export function addToLocalStorage(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}
