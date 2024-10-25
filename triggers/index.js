const crypto = require('crypto');
const { getAPIURL } = require('../environments');

const generateSecret = async () => {
  return crypto.randomBytes(32).toString('hex');
};

const perform = async (z, bundle) => {
  return [bundle.cleanedRequest.data];
};

const performSubscribe = (event) => async (z, bundle) => {
  const secret = await generateSecret();
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
      events: [event],
      secret,
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

const performList = (path, sorting) => async (z, bundle) => {
  const options = {
    url: `${getAPIURL(bundle.authData.environment)}${path}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      sorting,
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

const loadSample = (event) => {
  return require(`./samples/${event}.json`);
};

/** @type {{ event: string; path: string; sorting: string, key: string; label: string; description: string; noun: string, sample: object }[]} */
const TRIGGER_DEFINITIONS = [
  {
    event: 'order.created',
    path: '/v1/orders/',
    sorting: '-created_at',
    key: 'order_created',
    label: 'Order Created',
    description: 'Triggers when a new order is created.',
    noun: 'Order',
    sample: loadSample('order'),
  },
  {
    event: 'benefit.created',
    path: '/v1/benefits/',
    sorting: '',
    key: 'benefit_created',
    label: 'Benefit Created',
    description: 'Triggers when a new benefit is created.',
    noun: 'Benefit',
    sample: loadSample('benefit'),
  },
  {
    event: 'benefit.updated',
    path: '/v1/benefits/',
    sorting: '',
    key: 'benefit_updated',
    label: 'Benefit Updated',
    description: 'Triggers when a benefit is updated.',
    noun: 'Benefit',
    sample: loadSample('benefit'),
  },
  {
    event: 'checkout.created',
    path: '/v1/checkouts/custom/',
    sorting: '-created_at',
    key: 'checkout_created',
    label: 'Checkout Created',
    description: 'Triggers when a new checkout session is created.',
    noun: 'Checkout',
    sample: loadSample('checkout'),
  },
  {
    event: 'checkout.updated',
    path: '/v1/checkouts/custom/',
    sorting: '-created_at',
    key: 'checkout_updated',
    label: 'Checkout Updated',
    description: 'Triggers when a checkout session is updated.',
    noun: 'Checkout',
    sample: loadSample('checkout'),
  },
  {
    event: 'product.created',
    path: '/v1/products/',
    sorting: '-created_at',
    key: 'product_created',
    label: 'Product Created',
    description: 'Triggers when a new product is created.',
    noun: 'Product',
    sample: loadSample('product'),
  },
  {
    event: 'product.updated',
    path: '/v1/products/',
    sorting: '-created_at',
    key: 'product_updated',
    label: 'Product Updated',
    description: 'Triggers when a product is updated.',
    noun: 'Product',
    sample: loadSample('product'),
  },
  {
    event: 'subscription.active',
    path: '/v1/subscriptions/',
    sorting: '-started_at',
    key: 'subscription_active',
    label: 'Subscription Active',
    description: 'Triggers when a subscription becomes active.',
    noun: 'Subscription',
    sample: loadSample('subscription'),
  },
  {
    event: 'subscription.canceled',
    path: '/v1/subscriptions/',
    sorting: '-started_at',
    key: 'subscription_canceled',
    label: 'Subscription Canceled',
    description: 'Triggers when a subscription is canceled.',
    noun: 'Subscription',
    sample: loadSample('subscription'),
  },
  {
    event: 'subscription.created',
    path: '/v1/subscriptions/',
    sorting: '-started_at',
    key: 'subscription_created',
    label: 'Subscription Created',
    description: 'Triggers when a new subscription is created.',
    noun: 'Subscription',
    sample: loadSample('subscription'),
  },
  {
    event: 'subscription.revoked',
    path: '/v1/subscriptions/',
    sorting: '-started_at',
    key: 'subscription_revoked',
    label: 'Subscription Revoked',
    description: 'Triggers when a subscription is revoked.',
    noun: 'Subscription',
    sample: loadSample('subscription'),
  },
  {
    event: 'subscription.updated',
    path: '/v1/subscriptions/',
    sorting: '-started_at',
    key: 'subscription_updated',
    label: 'Subscription Updated',
    description: 'Triggers when a subscription is updated.',
    noun: 'Subscription',
    sample: loadSample('subscription'),
  },
];

const TRIGGERS = TRIGGER_DEFINITIONS.map(({ event, path, sorting, key, label, description, noun, sample }) => ({
  operation: {
    perform: perform,
    type: 'hook',
    performUnsubscribe: performUnsubscribe,
    performSubscribe: performSubscribe(event),
    performList: performList(path, sorting),
    sample,
  },
  display: {
    description,
    hidden: false,
    label,
  },
  key,
  noun,
}));

module.exports = TRIGGERS;
