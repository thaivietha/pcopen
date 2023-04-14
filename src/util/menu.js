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
import router from './router';
import perm from './perm';
import store from '../store';
import storage from './storage';

import {ACTIVE_TOP_MENU, LEFT_MENU_LIST, TOP_MENU_LIST} from '../store/mutation-type';

const menu = {
    loaded: false,
}, storageKey = 'topMenus';

/**
 * 获取缓存中全部导航
 * @returns {{}}
 */
menu.getStorageTopMenus = () => {
    return storage.get(storageKey);
};

/**
 * 重置缓存中全部导航
 * @returns {{}}
 */
menu.resetStorageTopMenus = () => {
    let router = require('@/router/router.js')['default'];
    let topMenus = {};
    router.forEach(function (topMenu) {
        // 先检测是否有访问权限
        if (menu.checkMenuPerm(topMenu)) {
            topMenus[topMenu.name] = topMenu;
        }
    });

    storage.set(storageKey, topMenus);
    return topMenus;
};

/**
 * 更新缓存中导航二级菜单
 * @param name
 * @param children
 * @returns {boolean}
 */
menu.updateStorageTopMenuChildren = (name, children) => {
    let storageTopMenus = menu.getStorageTopMenus();

    if (!storageTopMenus[name]) {
        return false;
    }

    storageTopMenus[name].children = children;

    storage.set(storageKey, storageTopMenus);
};

/**
 * 获取全部按钮
 * @param name
 * @returns {{}}
 */
menu.getTopMenu = (name) => {
    let topMenus = menu.getStorageTopMenus();

    return topMenus[name];
};

/**
 * 获取二级菜单
 * @param to 一级菜单路由
 * @param callback 回调方法
 * @returns {{route: string}[]|*}
 */
menu.getSubMenu = (to, callback) => {
    let name = typeof (to) === 'object' ? to.path.split('/')[1] : to.split('/')[1];
    let topMenu = menu.getTopMenu(name);
    if (!topMenu) {
        // 如果有回调方法则执行回调
        if (typeof callback === 'function') {
            return callback([], to);
        }
        return [];
    }

    // 获取二级菜单
    let subMenu = topMenu.children;

    // 如果未缓存下来则重新加载
    if (!subMenu) {
        try {
            subMenu = require('@/router/' + name + '.js')['default'];
        } catch (e) {
            subMenu = [];
        }

        // 处理二级菜单的权限
        if (subMenu.length > 0) {
            let newSubMenu = [];
            subMenu.forEach((item) => {
                if (!menu.checkMenuPerm(item)) {
                    return;
                }

                // 处理子级页面
                if (item.children && item.children.length > 0) {
                    let newChildren = [];
                    item.children.forEach((child) => {
                        if (!menu.checkMenuPerm(child)) {
                            return;
                        }
                        newChildren.push(child);
                    });
                    item.children = newChildren;
                }

                // 处理内页
                if (item.insidePages && item.insidePages.length > 0) {
                    let newInside = [];
                    item.insidePages.forEach((inside) => {
                        if (!menu.checkMenuPerm(inside)) {
                            return;
                        }
                        newInside.push(inside);
                    });
                    item.insidePages = newInside;
                }

                newSubMenu.push(item)
            });

            subMenu = newSubMenu;
        }

        // 更新二级菜单
        menu.updateStorageTopMenuChildren(name, subMenu);
    }

    // 存到store
    store.commit(LEFT_MENU_LIST, subMenu);

    // 如果有回调方法则执行回调
    if (typeof callback === 'function') {
        return callback(subMenu, to);
    }

    // 无回调方法则返回所有二级菜单
    return subMenu;
};

/**
 * 跳转路由前置处理
 * @param to
 * @param from
 * @param next
 */
menu.beforeEach = (to, from, next) => {
    let topMenus = menu.getStorageTopMenus();

    // 如果缓存中没有则读取顶部菜单并且将name设置为key值，存入缓存
    if (!topMenus) {
        topMenus = menu.resetStorageTopMenus();
    }

    // 存到store
    store.commit(TOP_MENU_LIST, topMenus);

    menu.beforeEachSubMenu(to, from, next);
};

/**
 * 跳转二级路由前置处理
 * @param to
 * @param from
 * @param next
 */
menu.beforeEachSubMenu = (to, from, next) => {

    menu.getSubMenu(to, (subMenu, to) => {

        // 如果匹配到则跳转
        if (to.matched.length > 0) {
            next();
            return;
        }

        // 未匹配注册
        menu.registerRoute(subMenu, to, from, next);
    });

    // 如果加载完成跳转
    if (menu.loaded) {
        next();
    }
};

/**
 * 动态注册路由
 * @param menus
 * @param to
 * @param from
 * @param next
 */
menu.registerRoute = (menus, to, from, next) => {
    let name = typeof (to) === 'object' ? to.path.split('/')[1] : to.split('/')[1];
    let topMenu = menu.getTopMenu(name);

    if (typeof next !== 'function') {
        next = store.getters.getRouterNextFunction;
    }

    if (!topMenu || (!topMenu.path && !topMenu.children.length)) {
        next({
            name: 'page-not-found'
        });
        return;
    }

    // 定义待注册路由与第一个路由
    let routes = [], firstRoute = null;

    // 如果一级菜单有路由并且未注册则执行注册
    if (topMenu.path && !menu.isRegistered(topMenu.path)) {
        if (menu.checkMenuPerm(topMenu)) {
            routes.push({
                path: topMenu.path,
                name: topMenu.name,
                meta:topMenu.meta || {},
                component: () => import('@/pages' + topMenu.path),
            });
        }
    }

    // 设置激活顶部菜单
    store.commit(ACTIVE_TOP_MENU, topMenu);

    // 注册子路由
    for (let topIndex in menus) {
        let top = menus[topIndex];

        // 如果有二级菜单
        if (top.children) {
            for (let childIndex in top.children) {
                let child = top.children[childIndex];
                // 如果一级菜单有路由并且未注册则执行注册
                if (child.path && !menu.isRegistered(child.path)) {
                    if (menu.checkMenuPerm(child)) {
                        routes.push({
                            path: child.path,
                            name: child.name,
                            meta:child.meta || {},
                            component: () => import('@/pages' + child.path),
                        });
                    }
                }

                // 三级菜单
                if (child.children) {
                    for (let thirdIndex in child.children) {
                        let third = child.children[thirdIndex];
                        if (third.path && !menu.isRegistered(third.path)) {
                            if (menu.checkMenuPerm(third)) {
                                routes.push({
                                    path: third.path,
                                    name: third.name,
                                    meta: third.meta || {},
                                    component: () => import('@/pages' + third.path),
                                });
                            }
                        }
                    }
                }

                // 二级菜单内页
                if (child.insidePages) {
                    for (let insideIndex in child.insidePages) {
                        let inside = child.insidePages[insideIndex];
                        if (inside.path && !menu.isRegistered(inside.path)) {
                            if (menu.checkMenuPerm(inside)) {
                                routes.push({
                                    path: inside.path,
                                    name: inside.name,
                                    component: () => import('@/pages' + inside.path),
                                });
                            }
                        }
                    }
                }

                // 处理第一个路由
                if (!firstRoute && child.path && menu.checkMenuPerm(child)) {
                    firstRoute = {
                        name: child.name,
                        path: child.path
                    };
                }
            }
        } else {
            // 没有子级菜单时注册自己
            if (top.path && !menu.isRegistered(top.path)) {
                if (menu.checkMenuPerm(topMenu)) {
                    routes.push({
                        path: top.path,
                        name: top.name,
                        component: () => import('@/pages' + top.path),
                    });
                }
            }

            // 处理第一个路由(没有子级菜单时)
            if (!firstRoute && top.path && menu.checkMenuPerm(top)) {
                firstRoute = {
                    name: top.name,
                    path: top.path
                };
            }
        }

        // 内置页面
        if (top.insidePages) {
            for (let insideIndex in top.insidePages) {
                let inside = top.insidePages[insideIndex];
                if (inside.path && !menu.isRegistered(inside.path)) {
                    if (menu.checkMenuPerm(inside)) {
                        routes.push({
                            path: inside.path,
                            name: inside.name,
                            component: () => import('@/pages' + inside.path),
                        });
                    }
                }
            }
        }
    }
    menu.getLayoutIndex = (routes) => {
        if (routes == '') {
            return 0
        }

        // huancun
        // router.options.routes

    }
     // let layIndex = menu.getLayoutIndex(routes)
    // 动态添加路由
    router.options.routes[0].children.push(...routes);

    // vue-route 加载路由
    router.addRoutes(router.options.routes);

    // 已经加载过
    menu.loaded = true;

    let toRoute = to;

    if (from === 'first') {
        if (firstRoute) {
            toRoute = firstRoute;
        } else {
            toRoute = topMenu;
        }
    }

    // 如果当前要注册的为空 并且还没注册上，说明是404
    if (routes.length < 1 && !menu.isRegistered(toRoute.path)) {
        next({
            path: '/404',
            replace: true
        });
        return;
    }

    // 如果当前页面
    if (toRoute.path !== router.currentRoute.path) {
        router.replace(toRoute);
    }

    next();
};

/**
 * 检测路由是否已经注册
 * @param path
 * @returns {boolean}
 */
menu.isRegistered = (path) => {
    let isRegistered = false;

    // routes[0]: util/router.js 中初始注册的主路由
    router.options.routes[0].children.forEach((route) => {
        if (route.path === path) {
            isRegistered = true;
            return false;
        }
    });

    return isRegistered;
};

/**
 * 跳转到模块默认页面
 * @param name
 */
menu.redirectToDefaultPage = (name) => {
    if (name === router.currentRoute.name) {
        return;
    }

    let topMenu = menu.getTopMenu(name);
    let to = '/' + name;

    // 如果有二级菜单，注册二级菜单
    if (topMenu.children) {
        // 存到store
        store.commit(LEFT_MENU_LIST, topMenu.children);

        menu.registerRoute(topMenu.children, to, 'first');
        return;
    }

    // 获取二级菜单
    let subMenu = menu.getSubMenu(to);

    // 注册二级菜单
    menu.registerRoute(subMenu, to, 'first');
};

/**
 * 检测菜单权限
 * @param menu
 * @returns {boolean}
 */
menu.checkMenuPerm = (menu) => {
    // 菜单未定义权限直接返回
    if (menu) return true
    if (!menu.perm) {
        return true;
    }
    // 菜单定义了权限调用检测
    return perm.check(menu.perm);
};

export default menu;
