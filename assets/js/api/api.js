export const getData = () => {
  return fetch("catalog.json").then((r) => {
    if (r.ok) return r.json();
    throw new Error(r.status);
  });
};
