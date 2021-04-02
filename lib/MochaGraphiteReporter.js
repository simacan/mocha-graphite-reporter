// MochaGraphiteReporter.js

'use strict';

const graphite = require('./GraphiteClient.js');
const Config = require('./Config');
const Mocha = require('mocha');
const {
    EVENT_RUN_BEGIN,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

String.prototype.sanitize = function(withString = '_') {
    return this.replace(/[^A-Za-z0-9,]/g, withString)
}

function logError(err) {
    if (err) { console.log(`MochaGraphiteReporter error: ${err.name} ; ${err.message}`); }
}

// this reporter sends the test results to a Graphite listener (eg. InfluxDB)
class MochaGraphiteReporter {
    constructor(runner, options) {

        const config = new Config(options)
        const carbonDsn = `plaintext://${config.graphiteHost}:${config.graphitePort}/`
        const environmentTag = config.getEnvironmentTag()

        this._suiteCrumble = []
        const client = graphite.createClient(carbonDsn)

        runner
            .once(EVENT_RUN_BEGIN, () => {
                console.log(`MochaGraphiteReporter reporting to: ${config.graphiteHost} (host) : ${config.graphitePort} (port)`);
                console.log(`Environment logging for ${config.environmentTag}: ${config.reportEnvironment ? 'enabled' : 'disabled'}`);
            })
            .on(EVENT_SUITE_BEGIN, (suite) => {
                this.pushSuite(suite.title);
            })
            .on(EVENT_SUITE_END, () => {
                this.popSuite();
            })
            .on(EVENT_TEST_PASS, test => {
                client.write({count:1, duration:test.duration}, this.prefix(test.title, 'ok', environmentTag), logError )
            })
            .on(EVENT_TEST_FAIL, (test, err) => {
                client.write({count:1}, this.prefix(test.title, 'ko', environmentTag), logError);
            })
    }

    /**
     *
     * @param {string} testTitle
     * @param {string} state
     * @param {string} environmentTag
     * @returns {string}
     */
    prefix(testTitle, state, environmentTag) {
        return `cypress.${this.suitePath()}${environmentTag}.${testTitle.sanitize()}.${state}.`
    }

    suitePath() {
        return this._suiteCrumble.join('.');
    }

    pushSuite(suiteTitle) {
        if (suiteTitle) { this._suiteCrumble.push(suiteTitle.sanitize()) }
    }

    popSuite() {
        this._suiteCrumble.pop()
    }

}

module.exports = MochaGraphiteReporter;
