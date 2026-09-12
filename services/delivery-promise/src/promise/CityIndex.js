// Node port of com.courier.promise.CityIndex

// Dataset keys are ASCII slugs: "Sao Paulo" becomes "sao paulo". Strip
// diacritics so accented input ("São Paulo") maps to the same key.
function normalizeCityKey(cityName) {
  return cityName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

class CityIndex {
  constructor() {
    this.cities = new Map();
  }

  add(city) {
    this.cities.set(normalizeCityKey(city.cityName), city);
  }

  find(lookupKey) {
    return this.cities.get(lookupKey) ?? null;
  }
}

module.exports = { CityIndex, normalizeCityKey };
