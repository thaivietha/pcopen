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
import * as mutationType from "../mutation-type";

const state = {
    topMenuList: {},
    activeTopMenu: '',
    leftMenuList: {},
    activeLeftMenu: '',
    crumbs: [],
};

const getters = {
    getTopMenuList: state => state.topMenuList,
    getLeftMenuList: (state) => state.leftMenuList,
};

const mutations = {
    [mutationType.TOP_MENU_LIST]: (state, result) => {
        state.topMenuList = result;
    },
    [mutationType.ACTIVE_TOP_MENU]: (state, result) => {
        state.activeTopMenu = result;
    },
    [mutationType.LEFT_MENU_LIST]: (state, result) => {
        state.leftMenuList = result;
    },
    [mutationType.CRUMBS]: (state, result) => {
        state.crumbs = result;
    },
};

export default {
    state,
    getters,
    mutations,
};
