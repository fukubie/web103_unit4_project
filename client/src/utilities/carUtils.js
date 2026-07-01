/**
 * Calculates the total price of a car based on chosen options.
 * @param {Array} options - The full list of all options fetched from the DB
 * @param {Number|String} exteriorId - Chosen exterior option ID
 * @param {Number|String} wheelsId - Chosen wheels option ID
 * @param {Number|String} interiorId - Chosen interior option ID
 * @returns {Number} Total accumulated price (Base price of $30,000 + chosen options)
 */
export const calculatePrice = (options, exteriorId, wheelsId, interiorId) => {
  const BASE_PRICE = 30000;
  
  if (!options || options.length === 0) return BASE_PRICE;

  const extPrice = options.find(o => o.id === parseInt(exteriorId))?.price || 0;
  const whPrice = options.find(o => o.id === parseInt(wheelsId))?.price || 0;
  const intPrice = options.find(o => o.id === parseInt(interiorId))?.price || 0;

  return BASE_PRICE + extPrice + whPrice + intPrice;
};

/**
 * Validates combinations early on the frontend to alert the user.
 * @returns {String|null} Error string if combination is invalid, or null if ok.
 */
export const checkImpossibleCombo = (exteriorId, interiorId) => {
  // Option ID 3 = Stealth Black, Option ID 10 = Alcantara Race Red
  if (parseInt(exteriorId) === 3 && parseInt(interiorId) === 10) {
    return "Impossible Combo! Stealth Black exterior cannot be paired with Alcantara Race Red interior due to material constraints.";
  }
  return null;
};