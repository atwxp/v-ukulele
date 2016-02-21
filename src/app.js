/**
 * @file   app main entry
 * @author wxp201013@163.com
 */

var Vue = require('vue');
var App = require('./app.vue');
var VueRouter = require('vue-router');

// install router
Vue.use(VueRouter);

// config router
var router = new VueRouter();

// filter
require('./filters')(Vue);

router.start(App, '#app');
