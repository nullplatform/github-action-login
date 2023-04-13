const dotenv = require('dotenv');
const core = require('@actions/core');
const HttpClient = require('./client');
const { decode } = require('./base64');
const { isEmpty } = require('./validate');
const { parse } = require('./json');

dotenv.config();

const TOKEN_VARIABLE_NAME = 'NULLPLATFORM_ACCESS_TOKEN';

async function run() {
  try {
    const client = new HttpClient();
    const encodedToken = core.getInput('token');
    if (isEmpty(encodedToken)) {
      core.setFailed('Input "token" cannot be empty');
    }
    const decodedToken = decode(encodedToken);
    const { client_id: clientId, client_secret: clientSecret } = parse(decodedToken);
    if (isEmpty(clientId) || isEmpty(clientSecret)) {
      core.setFailed('Input "token" is invalid');
    }
    core.info(`Logging into Nullplatform...`);
    const { token } = await client.post('login', { client_id: clientId, refresh_token: clientSecret });
    if (isEmpty(token)) {
      core.setFailed('Output "token" cannot be empty');
    }
    core.exportVariable(TOKEN_VARIABLE_NAME, token);
  } catch (error) {
    core.setFailed(`Login failed: ${error.message}`);
  }
}

run();
