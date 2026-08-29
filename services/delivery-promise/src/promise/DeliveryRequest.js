// Node port of com.courier.promise.DeliveryRequest (record)
class DeliveryRequest {
  constructor(requestId, city, countryCode, locale) {
    this.requestId = requestId;
    this.city = city;
    this.countryCode = countryCode;
    this.locale = locale;
  }
}

module.exports = { DeliveryRequest };
