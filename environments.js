const ENVIRONMENTS = {
    production: {
        api: 'https://api.polar.sh',
        frontend: 'https://polar.sh',
    },
    sandbox: {
        api: 'https://sandbox-api.polar.sh',
        frontend: 'https://sandbox.polar.sh',
    },
};

const getAPIURL = (environment) => {
    return ENVIRONMENTS[environment].api;
};

const getFrontendURL = (environment) => {
    return ENVIRONMENTS[environment].frontend;
}

module.exports = {
    getAPIURL,
    getFrontendURL,
};
