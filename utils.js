// utils.js

// Module containing utility functions
export const fetchData = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occurred`);
  }
  return response.json();
};

export const calculateDistance = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

export const error = (err) => console.warn(`ERROR(${err.code}): ${err.message}`);
