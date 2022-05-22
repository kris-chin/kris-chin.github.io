/*
    global-teardown.js

    This file is called before tests.
    We specicically need this for tests involving fetch.
*/

import {teardown} from 'jest-dev-server';

module.exports = async function globalTeardown() {
    console.log('Tearing down server...')
    await teardown();
}