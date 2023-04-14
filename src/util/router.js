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
import Router from 'vue-router';
import ViewUI from 'view-design';
import store from '../store';
import menu from './menu';
// store常量
import { ROUTER_NEXT_FUNCTION,ACCOUNT_LOGIN_TIP} from '../store/mutation-type';
// import util from './util';

import beforeEacher from '../router/beforeEach/index.js'
// import afterEacher from '../router/afterEach/index.js'
import interceptors from '../router/beforeEach/interceptors.js'

// 引入vue-router
Vue.use(Router);
//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
//push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
//replace
Router.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

// 主页面路由名称
// const MAIN_PAGE_ROUTER_NAME = 'layout-main';

// // 登录页面路由名称
const LOGIN_PAGE_ROUTER_NAME = '登录';
//

/**
 * vue-router 初始注册，[0]为主路由位置不可变更
 * @type {VueRouter}
 */
const router = new Router({
    mode: 'history',
    base:'/pc',
    routes: [
        {
            path: '/',
            name: 'layout-index',
            redirect: '/index',
            component: () => import('@/pages/layout/main'),
            children: [],
        },
        {
            path: '/member',
            name: 'member-index',
            component: () => import('@/pages/layout/member'),
            children: [
                {
                    path: '',
                    name: '账户管理',
                    meta:{
                      perm:true
                    },
                    component: () => import('@/pages/member/account'),
                },
                {
                    path: 'order',
                    name: '我的订单',
                    meta:{
                        perm:true
                    },
                    component: () => import('@/pages/member/order'),
                },
                {
                    path: 'address',
                    name: '地址管理',
                    meta:{
                        perm:true
                    },
                    component: () => import('@/pages/member/address'),
                },
                {
                    path: 'collect',
                    name: '我的收藏',
                    meta:{
                        perm:true
                    },
                    component: () => import('@/pages/member/collect'),
                },
                {
                    path: 'coupon',
                    name: '我的优惠券',
                    meta:{
                        perm:true
                    },
                    component: () => import('@/pages/member/coupon'),
                },
            ],
        },
        {
            path: '/account',
            name: 'account',
            component: () => import('@/pages/layout/account'),
            children: [
                {
                    path: 'login',
                    name: '登录',
                    component: () => import('@/pages/account/login'),
                },
                {
                    path: 'register',
                    name: '注册',
                    component: () => import('@/pages/account/register'),
                },
                {
                    path: 'forgetPassword',
                    name: '找回密码',
                    component: () => import('@/pages/account/forgetPassword'),
                },
            ]
        },
        {
            path: '/singlePage',
            name: 'error-page',
            component: () => import('@/pages/layout/single'),
            children: [
                {
                    path: '/404',
                    name: 'page-not-found',
                    component: () => import('@/pages/errorPage/404'),
                },
                {
                    path: '/maintenance',
                    name: '已打烊',
                    component: () => import('@/pages/errorPage/maintenance'),
                },

            ],
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    // iView Loading
    ViewUI.LoadingBar.start();
    // // 当前是否登录
    if (to.meta && to.meta.perm  && !store.state.login.isLogin) {//需要登录
        store.commit(ACCOUNT_LOGIN_TIP, '请先登录');
        ViewUI.Message.info('请先登录')
        next({
            name: LOGIN_PAGE_ROUTER_NAME,
        });
        return
    }
    try {
        //获取系统设置
        await beforeEacher.checkSessionId(to, from, next);
        await beforeEacher.getSysSetting(to);
        await beforeEacher.getChannelStatus();

        //获取商城基础信息
        await beforeEacher.getBasicInfo()

        interceptors(to,from).then(to=>{//获取完毕开始校验
            //通过检测，可以继续
            //跳轉tabbar頁面的处理
            next(to)
        }).catch(() =>{
            next(false)
        })
        // // 判断管理端是否关闭
        // if (beforeEacher.isAdminClose(to, from, next, store)) {
        //     return
        // }

        // #endif
        //处理缺少session-id
        // beforeEacher.haveSessionId();
        /**
         * 先要判断是否能够跳转
         * 有些页面需要先登录后跳转，如：分销中心
         * 有的页面需要绑定手机号
         */

    } catch (err) {
        next(false);
    }
    // if (!isLogin && to.name !== LOGIN_PAGE_ROUTER_NAME && util.inArray(to.name, NOT_NEED_LOGIN_ROUTER_NAME) < 0) {
    //     // 未登录并且当前不是登录页面，跳转至登录页面
    //     next({
    //         name: LOGIN_PAGE_ROUTER_NAME,
    //     });
    //     return;
    // } else if (isLogin && to.name === LOGIN_PAGE_ROUTER_NAME) {
    //     // 已登录并且当前是登录页面，跳转到系统主页面
    //     next({
    //         name: MAIN_PAGE_ROUTER_NAME
    //     });
    //     return;
    // }

    // 存储路由next方法
    store.commit(ROUTER_NEXT_FUNCTION, next);

    menu.beforeEach(to, from, next);
    next();
});

router.afterEach(() => {
    // iView Loading
    ViewUI.LoadingBar.finish();
});

export default router;
