//pages/components/validateUrl.js
export const isUrlValid = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  