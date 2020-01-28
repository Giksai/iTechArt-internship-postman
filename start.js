const Launcher = require('@wdio/cli').default;

const wdio = new Launcher('./wdio.conf.js');
wdio.run().then((code) => {
    process.exit(code);
}, (error) => {
    console.error('Launcher failed to start the test', error.stacktrace);
    process.exit(1);
});