// Node port of com.courier.promise.CityIndex
class CityIndex {
  constructor() {
    this.cities = new Map();
  }

  add(city) {
    // Dataset keys are ASCII slugs: "Sao Paulo" becomes "sao paulo".
    const key = city.cityName.trim().toLowerCase();
    this.cities.set(key, city);
  }

  find(lookupKey) {
    return this.cities.get(lookupKey) ?? null;
  }
}

module.exports = { CityIndex };
