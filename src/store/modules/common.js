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
import * as mutationType from '../mutation-type';
import goodsApi from '@/api/goods'
import commonApi from '@/api/common'

const state = {
    routerNextFunction: null,
    accountLoginTip: null,
    address: [],//地址库
    commonData: {}//页面底部 + 顶部数据

};

const getters = {
    getRouterNextFunction: state => state.routerNextFunction,
    getAccountLoginTip: state => state.accountLoginTip,
};
const actions = {
    getBasicInfo(state) {
        return new Promise((resolve) => {
            commonApi.getBasicInfo({
                hideSuccessTip: true,
                success: (res) => {
                    res.data.topMenus.forEach(item => {//url前面加 '/'
                        // if (item.url.indexOf('/') != 0) {
                        //     item.url = '/' + item.url
                        // }
                        console.log(item)
                    })
                    state.commit('setCommonData', res.data)
                    resolve()
                }
            })


        })
    },
    getCartCount(state) {//更新购物车数量
        goodsApi.cartCount({
            hideSuccessTip: true,
            success: (res) => {
                if (res.error != 0) return
                state.commit('setCartCount', res.count)
            }
        })
    }

}
const mutations = {
    setCartCount(state, CartCount) {
        state.commonData.cart_count = CartCount
    },
    setAddress(state, address) {
        state.address = address;
    },
    setCommonData(state, data) {
        state.commonData = data
    },
    [mutationType.ROUTER_NEXT_FUNCTION]: (state, result) => {
        state.routerNextFunction = result;
    },
    [mutationType.ACCOUNT_LOGIN_TIP]: (state, result) => {
        state.accountLoginTip = result;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
