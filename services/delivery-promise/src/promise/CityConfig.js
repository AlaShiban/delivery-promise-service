// Node port of com.courier.promise.CityConfig
class CityConfig {
  constructor(cityName, deliveryDays, currency) {
    this.cityName = cityName;
    this.deliveryDays = deliveryDays;
    this.currency = currency;
  }
}

module.exports = { CityConfig };
