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

export function createADataObj(group, category) {
  return { group, category };
}
