const STORAGE_KEY = "user_selection";

export const getDataFromSectionStore = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch ({ message }) {
    console.log(message);
  }
};

export const getDataFromStorage = (KEY) => {
  try {
    const data = sessionStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error.message);
  }
};

export const saveDataToSectionStore = (data = {}, KEY = STORAGE_KEY) => {
  return sessionStorage.setItem(KEY, JSON.stringify(data));
};
