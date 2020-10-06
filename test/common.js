var common = exports;
var path   = require('path');

common.dir      = {}
common.dir.root = path.dirname(__dirname);
common.dir.lib  = path.join(common.dir.root, 'lib');

common.port      = 12523;
common.carbonDsn = 'plaintext://localhost:' + common.port + '/';

common.mochaGraphiteReporter = require(common.dir.root);