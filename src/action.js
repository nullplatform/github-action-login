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

    const accessKey = core.getInput(Input.ACCESS_KEY); // Not implemented
    const secretAccessKey = core.getInput(Input.SECRET_ACCESS_KEY); // Not implemented
    const token = core.getInput(Input.TOKEN); // Deprecated
    const apiKey = core.getInput(Input.API_KEY);

    core.info('Validating inputs...');

    if (isEmpty(apiKey) && isEmpty(token) && (isEmpty(accessKey) || isEmpty(secretAccessKey))) {
      setFailed(`Input "${Input.API_KEY}" cannot be empty`);
    }
    if (isEmpty(apiKey)) {
      if (isEmpty(token) && (isEmpty(accessKey) || isEmpty(secretAccessKey))) {
        setFailed(`Input "${Input.TOKEN}" cannot be empty`);
      }

      if (isEmpty(token)) {
        if (isEmpty(accessKey) || isEmpty(secretAccessKey)) {
          setFailed(`Input "${Input.ACCESS_KEY}" and "${Input.SECRET_ACCESS_KEY}" cannot be empty`);
        }
      }
    }

    const method = () => {
      if (isEmpty(apiKey)) {
        if (isEmpty(token)) {
          return 'credentials';
        }
        return 'token';
      }
      return 'api-key';
    };

    core.info(`Logging into Nullplatform using ${method()}...`);

    const body = {};
    if (!isEmpty(apiKey)) {
      body[inputToKey(Input.API_KEY)] = apiKey;
    } else if (!isEmpty(token)) {
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

module.exports = run;
