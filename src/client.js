const http = require('@actions/http-client');
const config = require('./config');

class HttpClient {
    constructor() {
        this.client = new http.HttpClient();
        this.baseUrl = config.baseUrl;
    }

    async post(url, body) {
        const data = JSON.stringify(body);
        const response = await this.client.post(`${this.baseUrl}/${url}`, data);
        const { statusCode, statusMessage } = response.message;
        if (statusCode !== 200) {
            throw new Error (`POST to ${url} failed: [${statusCode}] ${statusMessage}`);
        }
        const result = await response.readBody();
        return JSON.parse(result);
    }
}

module.exports = HttpClient;
