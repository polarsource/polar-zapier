const authentication = require('./authentication');
const triggers = require('./triggers/index.js');

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
  triggers: triggers.reduce((acc, trigger) => ({ ...acc, [trigger.key]: trigger }), {}),
};
