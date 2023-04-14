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
 * 路由导航守卫各种权限判断
 */

import ViewUI from 'view-design';
const USER_LOGIN_SESSION_ID_KEY = 'userSessionId';
import store from '@/store'
import accountApi from '@/api/account'
import storage from '@/util/storage'
// 正式路由导航跳转前的各种检测
class Guard {
    sessionId = '';
    systemSetting = {}
    basicInfo = {}
    channelStatus = {}
    isClosed = null;
    sdkUrl = '';

    constructor() {
        this.sessionId = localStorage.getItem('session-id')
    }

    haveSessionId() { //是否有session-id
        if (!this.sessionId) { //用来减少查找时间localStorage.getItem;减少查询操作
            if (!localStorage.getItem('session-id')) {
                store.commit('login/setLogin', false)
            } else {
                this.sessionId = localStorage.getItem('session-id')
            }
        }
        return this.sessionId
    }

    checkSessionId() {//检查session ID
        return new Promise((resolve) => {
            this.sessionId = localStorage.getItem('userSessionId')
            if (this.sessionId) {
                resolve()
                return
            }
            // 调用接口请求
            accountApi.getSessionId({}, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.code === 0) {
                        storage.set(USER_LOGIN_SESSION_ID_KEY, {
                            session_id: res.data['session-id']
                        });
                        resolve()
                    }
                },
            })
        })

    }
    getBasicInfo(){//获取基础信息
        return new Promise((resolve)=>{

            if (!this.basicInfo?.bottomMenus) {
                store.dispatch('common/getBasicInfo').then(()=>{
                    resolve()
                })
            }else {
                resolve()

            }
        })
    }
    //获取系统设置
    // eslint-disable-next-line no-unused-vars
    getSysSetting(to) {
        return new Promise((resolve) => {
            if (!this.systemSetting?.basic) {
                store.dispatch('setting/getSysSetting').then(config => {

                    this.systemSetting = config;
                    resolve()
                }).catch(err => {
                    if (err.then || err instanceof Promise) {
                        err.catch(error => {
                            if (error?.errMsg?.includes('in domain list')) {
                                ViewUI.Message.error('小程序域名配置错误')
                            }
                        })
                        resolve()
                    } else {
                        resolve()
                        ViewUI.Message.error('系统设置错误')

                    }
                })
            } else {
                resolve()
            }
        })


    }

    getChannelStatus() { // 获取渠道设置
        return new Promise((resolve,reject) => {
            store.dispatch('login/getLoginStatus').then(res => {
                    if (res.error === 0) {
                        resolve(res)
                    } else {
                        reject(res)
                    }
                })
        })
    }
    getLoginStatus(){
        return new Promise((resolve,reject) => {
            store.dispatch('setting/getLoginStatus').then(res => {
                if (0 === +res.error) {
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch((err) => {
                ViewUI.Message.error(err)
            })
        })
    }

}

export default new Guard();
