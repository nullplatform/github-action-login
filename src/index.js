const dotenv = require('dotenv');
const core = require('@actions/core');
const HttpClient = require('./client');
const { isEmpty } = require('./validate');

dotenv.config();

const TOKEN_VARIABLE_NAME = 'NULLPLATFORM_ACCESS_TOKEN';

async function run() {
  try {
    const client = new HttpClient();

    const accessKey = core.getInput('access-key');
    const secretAccessKey = core.getInput('secret-access-key');
    const accessToken = core.getInput('access-token');

    core.info('Validating inputs...');

    if (isEmpty(accessToken) && isEmpty(accessKey)) {
      core.setFailed('Input "access-key" cannot be empty');
    }
    if (isEmpty(accessToken) && isEmpty(secretAccessKey)) {
      core.setFailed('Input "secret-access-key" cannot be empty');
    }
    if (isEmpty(accessToken)) {
      core.setFailed('Input "access-token" cannot be empty');
    }

    core.info(
      `Logging into Nullplatform using ${
        isEmpty(accessToken) ? 'credentials' : 'access token'
      }...`,
    );

    const body = {};
    if (!isEmpty(accessToken)) {
      body.access_token = accessToken;
    } else {
      body.access_key = accessKey;
      body.secret_access_key = secretAccessKey;
    }

    const { token } = await client.post('login', body);

    if (isEmpty(token)) {
      core.setFailed('Output "token" cannot be empty');
    }

    core.info('Successfully logged in into Nullplatform');

    core.setSecret(token);
    core.exportVariable(TOKEN_VARIABLE_NAME, token);
  } catch (error) {
    core.setFailed(`Login failed: ${error.message}`);
  }
}

run();
