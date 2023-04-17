const http = require('@actions/http-client');
const config = require('./config');

class HttpClient {
  constructor() {
    this.client = new http.HttpClient();
    this.client.requestOptions = {
      headers: { [http.Headers.ContentType]: 'application/json' },
    };
    this.baseUrl = config.baseUrl;
  }

  async post(path, body) {
    const url = `${this.baseUrl}/${path}`;
    const data = JSON.stringify(body);
    const response = await this.client.post(url, data);
    const { statusCode, statusMessage } = response.message;
    const result = await response.readBody();
    if (statusCode !== 200) {
      throw new Error(
        `POST to ${path} failed: [${statusCode}] ${statusMessage} - ${result}`,
      );
    }
    return JSON.parse(result);
  }
}

module.exports = HttpClient;
