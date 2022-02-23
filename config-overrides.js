/* config-overrides.js */


module.exports = {

    //Configure Webpack for regular use (ie. loaders)
    webpack: (config, env) => {

        //Webpack Loaders
        config.module.rules.push(
            {
                test: /\.json5$/i,
                use: 'json5-loader',
                type: 'javascript/auto',
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            }
        );

        return config;
    },

    //Configure Jest since it is called instead of webpack when running test
    jest: (config) => {
        //Set up TS-Jest so we can transform TS files
        config.preset = 'ts-jest'
        config.testEnvironment = 'node'

        //Set up transformers for jest for certain file extensions
        config.transform = {
            "^.+\\.[t|j]sx?$" : "ts-jest",
            "^.+\\.json5?$" : "json5-jest" 
        }

        //From my understanding: When we mix JS imports with TS imports, it gets kinda funky,
        //So, we ignore transformations for any JS imports (in this case, THREE.js's example files)
        //https://stackoverflow.com/questions/61781271/jest-wont-transform-the-module-syntaxerror-cannot-use-import-statement-outsi
        config.transformIgnorePatterns = [
            "node_modules/(?!three/.*)"
        ]

        //Add support for our other extensions
        config.moduleFileExtensions.push(".json5",".txt")

        //Specify Setup and Teardown Scripts to call before and after tests.
        config.globalSetup = "<rootDir>/test/global-setup.js"
        config.globalTeardown = "<rootDir>/test/global-teardown.js"

        return config;
    }
};
