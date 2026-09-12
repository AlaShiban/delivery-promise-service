// Node port of com.courier.promise.DeliveryPromiseService
const { DeliveryPromise } = require("./DeliveryPromise");
const { normalizeCityKey } = require("./CityIndex");

class DeliveryPromiseService {
  constructor(regionDatasetLoader, cityIndex) {
    this.regionDatasetLoader = regionDatasetLoader;
    this.cityIndex = cityIndex;
  }

  estimate(request) {
    const requestedCity = request.city;
    const lookupKey = normalizeCityKey(requestedCity);

    const regionDataset = this.regionDatasetLoader.current();
    const cityConfig = this.cityIndex.find(lookupKey);

    if (!cityConfig) {
      return DeliveryPromise.fallback(requestedCity, 7);
    }

    return new DeliveryPromise(cityConfig.cityName, cityConfig.deliveryDays, cityConfig.currency);
  }

  /** @deprecated Retained for migration compatibility. No known callers. */
  estimateDeliveryTimeV1Legacy(cityName) {
    const lookupKey = normalizeCityKey(cityName);
    const cityConfig = this.cityIndex.find(lookupKey);

    if (!cityConfig) return 10;
    return cityConfig.deliveryDays + 2;
  }
}

module.exports = { DeliveryPromiseService };
