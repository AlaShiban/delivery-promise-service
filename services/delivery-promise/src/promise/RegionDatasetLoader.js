// Node port of com.courier.promise.RegionDatasetLoader
class RegionDatasetLoader {
  constructor() {
    this._current = null;
  }

  current() {
    return this._current;
  }

  reload(json) {
    this._current = JSON.parse(json);
  }
}

module.exports = { RegionDatasetLoader };
