const dotenv = require('dotenv');
const core = require('@actions/core');
const HttpClient = require('./client');
const { isEmpty } = require('./validate');
const { Variable, Input, Output } = require('./enums');

dotenv.config();

const inputToKey = (input) => (!isEmpty(input) ? input.replace(/-/g, '_') : null);

const setFailed = (error) => {
  core.setFailed(error);
  process.exit(1);
};

async function run() {
  try {
    const client = new HttpClient();

    const accessKey = core.getInput(Input.ACCESS_KEY);
    const secretAccessKey = core.getInput(Input.SECRET_ACCESS_KEY);
    const token = core.getInput(Input.TOKEN);

    core.info('Validating inputs...');

    if (isEmpty(token) && isEmpty(accessKey)) {
      setFailed(`Input "${Input.ACCESS_KEY}" cannot be empty`);
    }
    if (isEmpty(token) && isEmpty(secretAccessKey)) {
      setFailed(`Input "${Input.SECRET_ACCESS_KEY}" cannot be empty`);
    }
    if (isEmpty(token)) {
      setFailed(`Input "${Input.TOKEN}" cannot be empty`);
    }

    core.info(
      `Logging into Nullplatform using ${
        isEmpty(token) ? 'credentials' : 'token'
      }...`,
    );

    const body = {};
    if (!isEmpty(token)) {
      body[inputToKey(Input.TOKEN)] = token;
    } else {
      body[inputToKey(Input.ACCESS_KEY)] = accessKey;
      body[inputToKey(Input.SECRET_ACCESS_KEY)] = secretAccessKey;
    }

    const { access_token: accessToken } = await client.post('login', body);

    if (isEmpty(accessToken)) {
      setFailed(`Output "${Output.ACCESS_TOKEN}" cannot be empty`);
    }

    core.info('Successfully logged in into Nullplatform');

    core.setSecret(accessToken);
    core.setOutput(Output.ACCESS_TOKEN, accessToken);
    core.exportVariable(Variable.NULLPLATFORM_ACCESS_TOKEN, accessToken);
  } catch (error) {
    setFailed(`Login failed: ${error.message}`);
  }
}

run();
