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
import userApi from '@/api/user'

export default {
    namespaced: true,
    state: {
        registForm: null,
        user: {},
        bind_user: {},
        bind_mobile: null,
        isSkip: false,
        isLogin: null,
        isBind: null,
        isNeedBind: null,
        pendingApis: [],
        userInfo: {},
        subcriber:{},//
        oldLength: null, // 跳转前路由栈数量
        loginVisible: false,
        phoneVisible: false,
        mobileSubs: {}
    },
    mutations: {
        setOldLength(state, len) {
            state.oldLength = len
        },
        // 设置注册表单填写信息
        setRegistData(state, data) {
            state.registForm = {
                ...data
            }
        },
        clearRegistData(state) {
            state.registForm = null
        },
        // 设置绑定冲突用户信息
        setBindUser(state, info) {
            ['user', 'bind_mobile', 'bind_user'].forEach(k => {
                state[k] = info[k]
            })
        },
        // 设置用户信息
        setUserInfo(state, info) {
            if(!info){
                state.userInfo = {}
            }
            if(state.userInfo != info){
                state.userInfo = {...state.userInfo,...info}
            }
        },
        setLogin(state, isLogin) {
            if (state.isLogin != isLogin) {
                state.isLogin = isLogin;
            }
            // if(isLogin && state.loginVisible ){
            //     state.loginVisible = false
            // }
        },
        // eslint-disable-next-line no-unused-vars
        clearBindUser(state) {
            let emptyObj = {
                user: {},
                bind_user: {},
                bind_mobile: null
            }
            state = {
                ...state,
                ...emptyObj
            }
        },
        startSkip(state, status) {
            if(state.isSkip != status){
                state.isSkip = status
            }
        },
        setSubscriber(state,{name,fun}){
            state.subcriber[name]=fun
        },
        setPhoneSub(state, {name,fun}){
            state.mobileSubs[name] = fun
        },
        // 设置登录状态


        // 设置是否强制绑定手机号
        setNeedBind(state, needBind) {
            if(state.isNeedBind != needBind){
                state.isNeedBind = needBind
            }

        },
        // 设置模态框状态
        setModal(state, status) {
            if(status === true) {
                if(!state.isLogin){
                    state.loginVisible = true
                } else {
                    state.phoneVisible = true
                }
            } else {
                state.loginVisible = false;
                state.phoneVisible = false
            }
        }
    },
    actions:{
        getLoginStatus(ctx){
            return new Promise((resolve, reject) => {
                userApi.getLoginStatus( {
                    hideSuccessTip: true,
                    success: res => {
                        if (res.error === 0) {
                            if(res.member_id){
                                ctx.commit('setLogin', true)
                            }else{
                                ctx.commit('setLogin', false)
                            }
                            resolve(res)
                        } else {
                            ctx.commit('setLogin', false)
                            reject(res)
                        }
                    }
                })
            })
        }
    },
    getters: {
        registForm: state => state.registForm,
        user: state => state.user,
        bind_user: state => state.bind_user,
        bind_mobile: state => state.bind_mobile,
        isSkip: state => state.isSkip,
        isLogin: state => state.isLogin,
        isBind: state => state.isBind,
        userInfo: state => state.userInfo,
        loginVisible: state => state.loginVisible,
        phoneVisible: state => state.phoneVisible
    }
}