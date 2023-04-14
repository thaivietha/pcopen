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
import Vuex from 'vuex';
import common from './modules/common';
import menu from './modules/menu';
import setting from './modules/setting'
import login from './modules/login'
import order from './modules/order'
import persistedState from 'vuex-persistedstate'//持久化

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // setting: {
        //     shopStorage: {
        //         "base_url": "",
        //         "attachment_url": "",
        //         "public_url": "",
        //         "wap_dist_url": "",
        //         "wap_url": "",
        //         "with_recharge": ,
        //     }
        //     // "with_live":
        // }
    },
    modules: {
        common,
        menu,
        setting,
        login,
        order
    },
    plugins: [persistedState()]
});

export default store;
