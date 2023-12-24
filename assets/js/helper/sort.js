export function sortProducts(products, sortType) {
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
