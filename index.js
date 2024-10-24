const authentication = require('./authentication');
const orderCreatedTrigger = require('./triggers/order_created.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  requestTemplate: {
    headers: {
      Authorization: 'Bearer {{bundle.authData.access_token}}',
    },
    params: {},
  },
  triggers: { [orderCreatedTrigger.key]: orderCreatedTrigger },
};
