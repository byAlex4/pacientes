const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
    'event-target-shim': require.resolve('event-target-shim'),
};

module.exports = defaultConfig;
