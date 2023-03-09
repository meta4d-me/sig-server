/* eslint valid-jsdoc: "off" */

'use strict';

const env = require("./env.json");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1678257608792_5914';

    config.security = {
        csrf: {
            enable: false,
        },
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };

    config.logger = {
        dir: './logs',
    };

    config.customLogger = {
        scheduleLogger: {
            consoleLevel: 'NONE',
            file: './logs/egg-schedule.log',
        },
    };

    config.schedule = {
        directory: [],
    };

    // add your middleware config here
    config.middleware = [];
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        mumbai: {
            confirmedBlock: 1,
            nodeUrl: env.NODE_URL_MUMBAI,
            baggageContract: "0xdd5b1C4685A34Ff07A21Ca2507D4b80e60EbC85f"
        }
    };

    return {
        ...config,
        ...userConfig,
    };
};
