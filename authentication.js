const { getAPIURL, getFrontendURL } = require('./environments');
const scopes = require('./scope');

const test = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.inputData.environment || bundle.authData.environment)}/v1/oauth2/userinfo`,
    method: 'GET',
    headers: {},
    params: {},
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const authorizeUrl = async (z, bundle) => {
  const url = `${getFrontendURL(bundle.inputData.environment || bundle.authData.environment)}/oauth2/authorize?sub_type=organization&client_id=${
    process.env.CLIENT_ID
  }&state=${bundle.inputData.state}&redirect_uri=${encodeURIComponent(
    bundle.inputData.redirect_uri,
  )}&response_type=code`;

  return url;
};

const getAccessToken = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.inputData.environment || bundle.authData.environment)}/v1/oauth2/token`,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      authorization: null,
    },
    params: {},
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: bundle.inputData.redirect_uri,
      code_verifier: bundle.inputData.code_verifier,
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const refreshAccessToken = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.inputData.environment || bundle.authData.environment)}/v1/oauth2/token`,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
      authorization: null,
    },
    params: {},
    body: {
      refresh_token: bundle.authData.refresh_token,
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

const connectionLabel = async (z, bundle) => {
  const environment = bundle.inputData.environment || bundle.authData.environment;
  const isSandbox = environment === 'sandbox';
  return `${isSandbox ? '[SANDBOX] ' : ''}${bundle.inputData.name}`;
};

module.exports = {
  type: 'oauth2',
  test: test,
  fields: [
    {
      choices: [
        {
          label: 'Production',
          sample: 'production',
          value: 'production',
        },
        {
          label: 'Sandbox',
          sample: 'sandbox',
          value: 'sandbox',
        },
      ],
      default: 'production',
      computed: false,
      key: 'environment',
      required: true,
      label: 'Environment',
      type: 'string',
      helpText: 'Use the sandbox environment for testing and development. Read more: https://docs.polar.sh/sandbox',
    },
  ],
  oauth2Config: {
    authorizeUrl: authorizeUrl,
    getAccessToken: getAccessToken,
    refreshAccessToken: refreshAccessToken,
    enablePkce: true,
    scope: scopes.join(' '),
    autoRefresh: true,
  },
  connectionLabel: connectionLabel,
};
