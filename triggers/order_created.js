const { getAPIURL } = require('../environments');

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest];
};

const performSubscribe = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.authData.environment)}/v1/webhooks/endpoints`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {},
    body: {
      url: bundle.targetUrl,
      format: 'raw',
      events: ['order.created'],
      secret: 'ZapierTest',
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

const performUnsubscribe = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.authData.environment)}/v1/webhooks/endpoints/${bundle.subscribeData.id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: {},
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options);
};

const performList = async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.authData.environment)}/v1/orders/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      sorting: '-created_at',
    },
    removeMissingValuesFrom: {
      body: false,
      params: false,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json.items;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    type: 'hook',
    performUnsubscribe: performUnsubscribe,
    performSubscribe: performSubscribe,
    performList: performList,
  },
  display: {
    description: 'Triggers when a new order is created.',
    hidden: false,
    label: 'Order Created',
  },
  key: 'order_created',
  noun: 'Order',
};
