/**
 * 开店星公众版
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
import Vue from 'vue';
import App from './App.vue';
import router from './util/router';
import store from './store';
import ViewUI from 'view-design';
import './assets/css/my-theme.less';
import perm from './util/perm';
import 'view-design/dist/styles/iview.css';
import './assets/css/main.scss';
import './assets/css/reset.scss';

// import * as utils from "./util/jsTool.js";
import GlobalMixin from "./util/GlobalMixin.js";

import Container from './components/Container/Container.vue'
import ToolBar from './components/common/ToolBar'
import Breadcrumbs from './components/common/Breadcrumbs'
import EmptyPage from './components/common/EmptyPage'
Vue.component("Container",Container)
Vue.component("Breadcrumbs",Breadcrumbs)
Vue.component("ToolBar",ToolBar)
Vue.component("EmptyPage",EmptyPage)

Vue.use(ViewUI);
import { dragscroll } from './util/directive'
Vue.directive('dragscroll',dragscroll)

Vue.config.productionTip = false;
// Vue.prototype.$utils = utils;

/**
 * 全局混入
 */
Vue.use(GlobalMixin);

// 挂载权限检测属性
Vue.prototype.perm = perm.check;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');