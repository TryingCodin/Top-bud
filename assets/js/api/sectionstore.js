const STORAGE_KEY = "user_selection";

export const getDataFromSectionStore = () => {
  return sessionStorage.getItem(STORAGE_KEY);
};

export const saveDataToSectionStore = (data = {}) => {
  return sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
