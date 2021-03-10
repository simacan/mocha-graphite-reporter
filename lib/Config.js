class Config {

    reporterOptions = {};
    graphiteHost = undefined;
    graphitePort = 2003;
    reportEnvironment = false;
    environmentTag = '';

    constructor(options) {
        this.reporterOptions = this.findReporterOptions(options);
        this.graphiteHost =
            this.getSetting(this.reporterOptions.graphiteHost, "MGR_GRAPHITE_HOST", this.graphiteHost);
        this.graphitePort =
            this.getSetting(this.reporterOptions.graphitePort, "MGR_GRAPHITE_PORT", this.graphitePort);
        this.reportEnvironment =
            this.getSetting(this.reporterOptions.reportEnvironment, "MGR_REPORT_ENVIRONMENT", this.reportEnvironment);
        this.environmentTag =
            this.getSetting(this.reporterOptions.environmentTag, "MGR_ENVIRONMENT_TAG", this.environmentTag);
    }

    findReporterOptions(options) {
        if (!options) {
            // No options provided
            return {};
        }

        // Options provided
        return options.reporterOptions || {};
    }

    getSetting(value, key, defaultVal) {
        if (process.env[key] !== undefined) {
            return process.env[key];
        }
        if (value !== undefined) {
            return value;
        }
        return defaultVal;
    }

    getEnvironmentTag() {
        return this.reportEnvironment && this.environmentTag ? `.${this.environmentTag}` : ''
    }

}

module.exports = Config;
