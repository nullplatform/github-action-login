<h2 align="center">
    <a href="https://httpie.io" target="blank_">
        <img height="100" alt="nullplatform" src="https://nullplatform.com/favicon/android-chrome-192x192.png" />
    </a>
    <br>
    <br>
    Nullplatform Login GitHub Action
    <br>
</h2>

## Overview

The "Nullplatform Login" GitHub Action automates the login process for Nullplatform, allowing you to securely access Nullplatform services within your workflows. It provides a convenient way to authenticate and obtain an access token for use in subsequent steps.

## Table of Contents

- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage](#usage)
- [License](#license)

## Inputs

### `api-key`

- **Description**: Nullplatform API key. This should be added as a repository secret named `NULLPLATFORM_API_KEY` when you create/import an application
- **Required**: Yes

## Outputs

### `access-token`

- **Description**: The Nullplatform access token required on every subsequent nullplatform Github action

## Usage

```yaml
name: Login to Nullplatform with API Key
on:
  push:
    branches:
      - main

jobs:
  login:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Login to Nullplatform
      id: login
      uses: nullplatform/nullplatform-login-action@v1
      with:
        api-key: ${{ secrets.NULLPLATFORM_API_KEY }}
        
    - name: Use Access Token
      run: echo "Access Token: ${{ steps.login.outputs.access-token }}"
```

In this example, the GitHub Action logs in to Nullplatform using the provided API key and retrieves the access token, which can be used in subsequent steps.

## License

This GitHub Action is licensed under the [MIT License](LICENSE).
