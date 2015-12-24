/**
 * nsky daijia page
 * @author: qubaoming@didichuxing.com
 * @date: 2015/11/27
 */

define(function(require, exports, module){
    // system load
    var $ = require('$'),
        _ = require('underscore'),
        nWidget = require('../../common/nWidget');

    var utilTool = require('./util/util-tool');
    var uiUtil = require('../../common/ui-common');

    require('./common/handlebar-helper');
    require('../../lib/bootstrap/bootstrap.min');

    var eventsCenter = require('./controller/events-center');
    var MainNav = require('./views/main-nav/main-nav');
    var MapManager = require('./map/map-manager');

    var SENIOR_CONFIG = require('./config/senior-config');
    /**
     * daijia page
     * @extends Widget
     */
    var daijiaPage = nWidget.extend({
        attrs: {
            template: require('/dist/pages/daijia/compiled/daijia-tpl.js')
        }
    });

    module.exports = daijiaPage;
});
