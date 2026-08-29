// Node port of com.courier.promise.DeliveryPromiseService
const { DeliveryPromise } = require("./DeliveryPromise");

class DeliveryPromiseService {
  constructor(regionDatasetLoader, cityIndex) {
    this.regionDatasetLoader = regionDatasetLoader;
    this.cityIndex = cityIndex;
  }

  estimate(request) {
    const requestedCity = request.city;
    const lookupKey = requestedCity.trim().toLowerCase();

    const regionDataset = this.regionDatasetLoader.current();
    const cityConfig = this.cityIndex.find(lookupKey);

    if (!cityConfig) {
      return DeliveryPromise.fallback(requestedCity, 7);
    }

    return new DeliveryPromise(cityConfig.cityName, cityConfig.deliveryDays, cityConfig.currency);
  }

  /** @deprecated Retained for migration compatibility. No known callers. */
  estimateDeliveryTimeV1Legacy(cityName) {
    const lookupKey = cityName.trim().toLowerCase();
    const cityConfig = this.cityIndex.find(lookupKey);

    if (!cityConfig) return 10;
    return cityConfig.deliveryDays + 2;
  }
}

module.exports = { DeliveryPromiseService };
