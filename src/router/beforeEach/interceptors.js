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
let cacheNavPage = {};//跳转过的页面的缓存
let interceptors = []; //路由重定向拦截
import store from '@/store'
import {deepCopy} from '@/util/jsTool.js'


//判断是否打烊
// eslint-disable-next-line no-unused-vars
function shopIsClosed(to, from) {
    //判断是否打烊
    if (store.state.setting?.channelStatus === 0) {
        // /singlePage/maintenance
        if (to.path != '/maintenance') {
            window.location.href = '/maintenance'
        }
        if(to.path == '/maintenance'){
            return to
        }
    }
    return to
}

//判断商城是否关闭
function mallIsClosed(to) {
    let isClosed = false;
    let from = 'mallIsClosed'
    let mall_status = store.state.setting.systemSetting?.basic?.mall_status;
    if(( mall_status == '0' || store.state.setting.channelStatus.wxapp_setting?.maintain == '1') && to.path !== '/maintenance'){
        isClosed = true
    }
    //判断商城是否已经关闭
    if (isClosed) {
        if (to.path == '/maintenance') {
            return to
        } else {
            return {
                path: '/maintenance',
                NAVTYPE: 'replace',
                query: {
                    from,
                }
            }
        }
    }
    return to
}
/**
 * 页面跳转前会依次检查以下函数的返回值，
 * 函数返回值为空值不会跳转
 * 如需重定向只需要返回{path:'url',query:{data:'xxx'}，NAVTYPE: 'xxx'}格式的对象即可
 *
 * ！！！！！！这里的函数只处理同步函数，异步操作请加到afterEach中！！！！！！
 *
 */
interceptors = {
    0: shopIsClosed,
    1: mallIsClosed,
}

/**
 * 递归检验以上函数的结果，直到返回的路由对象不再变化
 * 如果其中一个函数返回了空值就不会继续向下检测
 * @param {} to
 * @param {*} from
 */
function recursor(to, from) {
    let routeFun = null;
    let newTo = deepCopy(to);
    try {
        for (let i in interceptors) {
            routeFun = interceptors[i];
            if (typeof routeFun === 'function') {
                newTo = routeFun(newTo, from);
                if (!newTo || !newTo.path) {
                    break;
                }
            }
        }
    } catch (e) {
        console.log(e, '?????????')
    }

    if (newTo && newTo.path != to.path) {
        return recursor(newTo, from)
    } else {
        return newTo
    }
}

export default function (to, from) {
    return new Promise((resolve, reject) => {

        // if (cacheNavPage[to.path]) {//已跳转过的页面不再检测
        //     resolve()
        //     return
        // }
        let route = recursor(to, from);
        // console.log(route,'uuuuuuuuuuuuuuu')
        if (to.path == route.path) {//经过检测，无需重定向
            cacheNavPage[route.path] = route
            resolve()
        } else if (route && route.path) {
            cacheNavPage[route.path] = route
            resolve(route)
        } else {
            reject(route)
        }
    })

}
