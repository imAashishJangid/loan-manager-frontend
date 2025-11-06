const KEY = "loan_manager_v1";

export const loadData = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("loadData error", e);
    return [];
  }
};

export const saveData = (arr) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (e) {
    console.error("saveData error", e);
  }
};

export const clearData = () => localStorage.removeItem(KEY);
