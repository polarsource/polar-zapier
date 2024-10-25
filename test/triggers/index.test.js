const zapier = require('zapier-platform-core');

const triggers = require('../../triggers');
// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

const triggerKeys = triggers.map(({ key }) => key);

describe('triggers', () => {
  test.each(triggerKeys)('trigger %s should run', async (key) => {
    const bundle = {
      inputData: {},
      cleanedRequest: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        content: {
          event: key,
          data: {},
        },
      },
    };

    const results = await appTester(App.triggers[key].operation.perform, bundle);
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
