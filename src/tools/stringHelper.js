/**
 * Simple helper to convert "aNy CapiTaliSation.with.dots too" to "Any Capitalisation With Dots Too"
 *
 * @param {string} str
 */
export const CamelCaseWithSpaces = (str) => {
  return str
    .replace(".", " ")
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};
