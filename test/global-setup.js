/*
    global-setup.js

    This file is called before tests.
    We specicically need this for tests involving fetch.
*/

import { setup } from 'jest-dev-server';
import tcpPortUsed from 'tcp-port-used';

module.exports = async function globalSetup() {

    //First check to see if port is being used by the dev server
    console.log('\nChecking if port 3000 is open..')
    await tcpPortUsed.check(3000, '127.0.0.1')
    .then(
    async (inUse)=> {
        //If it is, kill the port
        if (inUse) {
            console.log('Server is already open. Continuing.')
        } else {
            console.log('Port is free, starting server')
            await setup({
                command: "BROWSER=none npm run start",
                debug:true,
            })
        }

    }, (error) => {
        console.error('Error: ', error)
    })

}