# Nullplatform Login GitHub Action

<p align="center">
  <a href="https://github.com/nullplatform/github-action-login/actions"><img alt="javscript-action status" src="https://github.com/nullplatform/github-action-login/workflows/units-test/badge.svg"></a>
</p>

You can use the GitHub Action to automate the login process on Nullplatform.

## Code

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid credentials (3ms)
  ✓ logins into nullplatform (504ms)
  ✓ other test (95ms)
...
```

## Change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Package for distribution

Update version in ``package.json`` file and then run:

```bash
npm run update:version
```

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: nullplatform/github-action-login@v1
with:
  api-key: ${{ secrets.NULLPLATFORM_API_KEY }}
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:
