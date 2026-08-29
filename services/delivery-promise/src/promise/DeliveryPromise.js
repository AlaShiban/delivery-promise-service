// Node port of com.courier.promise.DeliveryPromise
class DeliveryPromise {
  constructor(cityName, deliveryDays, currency, fallback = false) {
    this.cityName = cityName;
    this.deliveryDays = deliveryDays;
    this.currency = currency;
    this.fallback = fallback;
  }

  static fallback(requestedCity, days) {
    return new DeliveryPromise(requestedCity, days, "USD", true);
  }
}

module.exports = { DeliveryPromise };
