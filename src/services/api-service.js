class ApiService {
  _apiBase = "https://api.coincap.io/v2/assets";

  async getAssets() {
    const url = new URL(this._apiBase);
    const params = { limit: 15 };

    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url)
      .then(res => res.json())
      .then(data => data);

    return response.data;
  }
}

export default ApiService;
