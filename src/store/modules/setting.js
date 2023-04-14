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
/**
 * @Description: 商城设置
 * @author  Gao
 * @date 2022/1/26
 */
import settingApi from '@/api/settings/setting'

let config = require('../../config/settings').config
import * as utils from '@/util/jsTool.js'
import Vue from 'vue'
// import ThemeContext from '../../components/theme/theme.js'

export default {
    namespaced: true,
    state: {
        systemSetting: {},
        cacheLoadingImg: '',
        channelStatus: false,
        closeStatus: false,
        avatar: '',
        pluginsPerms: {},
        verifySetting: {},
        configSettings: config,
        shopStorage: {
            attachmentUrl: '',
            attachmentSuffix: ''
        },
        login_bg_path: '',
    },
    mutations: {
        setAvatar(state, url) {
            state.avatar = url
        },
        setSystemSetting(state, res) {
            state.systemSetting = res;
            state.pluginsPerms = res.plugins;
        },
        setCacheLoadingImg(state, src) {
            state.cacheLoadingImg = src
        },
        setChannelStatus(state, res) {
            state.channelStatus = res
        },
        setShopStorage(state, res) {
            let {storage} = res;
            // 店铺时独立存储20时赋值
            state.shopStorage.attachmentUrl = 20 === +storage?.storage_model ? res?.shop_attachment_url : '';
            if (storage?.type !== 'local' && 20 === +storage?.storage_model && 1 === +storage?.[storage.type]?.image_compression) {
                state.shopStorage.attachmentSuffix = storage?.[storage.type]?.image_compression_rule?.rule;
            } else {
                state.shopStorage.attachmentSuffix = '';
            }
        },
        // 登录图片临时缓存地址
        setPath(state, res) {
            state.login_bg_path = res
        },
    },
    actions: {
        getSysSetting(store) {
            // 获取loading的缓存
            return new Promise((resolve, reject) => {
                settingApi.getSysSetting({}, {
                    hideSuccessTip: true,
                    success: (res) => {
                        if (res.error == 0) {
                            // 获取登录弹窗图片
                            store.dispatch('getLoginImg', res?.login_auth_setting)
                            // 获取懒加载图片
                            store.dispatch('getLoadingImg', res.basic.loading)
                            store.commit('setSystemSetting', res);
                            resolve(res)
                            return
                        }
                        // 当渠道没有权限时
                        let path = Vue.prototype.$Route.path;
                        if (res.error === -10004) {
                            store.commit('setSystemSetting', {plugins: ''});
                            if (path == '/maintenance') {
                                return
                            }
                            Vue.prototype.$router.pushAll({
                                path: '/maintenance'
                            })
                        }
                        reject(res)
                    }
                })
            })
        },
        getLoginImg(ctx, login_auth_setting) { // 获取登录弹窗图片
            if (login_auth_setting?.type === '0') {
                // 登录图片处理
                ctx.commit('setPath', utils.staticMedia('login/style' + login_auth_setting?.style + '.png'))
            }
        },
        getLoadingImg(ctx, imgSrc) {  // 获取懒加载图
            let loadingSrc;
            if (imgSrc) {
                loadingSrc = utils.mediaUrl(imgSrc)
            } else {
                loadingSrc = utils.staticMedia('decorate/goods_col2.png')
            }
            ctx.commit('setCacheLoadingImg', loadingSrc)

        },

        getChannelStatus(ctx) {
            return new Promise((resolve, reject) => {
                settingApi.getChannelStatus({}, {
                    hideSuccessTip: true,
                    success: res => {
                        if (res.error == 0) {
                            ctx.commit('setChannelStatus', res.pc)
                            resolve(res)
                        } else {
                            reject(res.message)
                        }
                    }
                })
            })
        },
    },
    getters: {
    }
}
