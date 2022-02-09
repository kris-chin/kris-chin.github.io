/* config-overrides.js */


module.exports = (config,env) => {

    config.module.rules.push(
        {
            test: /\.json5$/i,
            use: 'json5-loader',
            type: 'javascript/auto',
            options:{
                esModule: false,
            }
        },
        {
            test: /\.txt$/i,
            use: 'raw-loader',
        }
    )

    return config;
};
