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
import axios from 'axios';
import {Message} from 'view-design';
import util from './util';
import account from './account';
import ViewUI from 'view-design';
import router from '../util/router'
import qs from 'qs'

// 携带信息
axios.defaults.withCredentials = true;

/**
 * 默认超时时间
 * @type {number}
 */
let defaultTimeout = 5000 * 6;

/**
 * 消息停留时间
 * @type {number}
 */
let messageStayDuration = 1.5;

// 拦截错误
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        Message.error({
            content: '接口响应错误 status:' + error.response.status,
            duration: messageStayDuration
        });
    }
});

const request = {};

/**
 * 公用请求
 * @param method {string}
 * @param route API路由
 * @param params 请求参数
 * @param options{{success: "成功回调", fail: "失败回调", hideTip: "隐藏提示", hideSuccessTip: "隐藏成功提示", hideErrorTip: "隐藏错误提示", successTip: "成功提示", failTip: "失败提示", timeout: "超时时间", headers: "请求头"}|{}} 附加选项
 * @returns {{}}
 */
request.request = (method, route, params, options) => {
    let url = util.formatUrl(route, method === 'post' ? {} : params);
    // 如果options类型为function那么把它定义为success回调
    if (typeof options == 'function') {
        options = {
            success: options,
        };
    }

    options = options || {};

    // 定义axios的配置参数
    let axiosConfig = {
        headers: options.headers || {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
        timeout: options.timeout || defaultTimeout,
    };

    // 塞入session-id、client-type
    axiosConfig.headers['Session-Id'] = account.getSessionId() || '';
    axiosConfig.headers['Client-Type'] = '70'

    // 执行调用请求
    let response = method === 'post' ? axios.post(url, options.raw ? params : qs.stringify(params), axiosConfig) : axios.get(url, axiosConfig);

    // 成功回调
    let successCallback = (result) => {
        if (options.success && typeof options.success == 'function') {
            options.success(result);
        }
    };

    // 失败回调
    let failCallback = (result) => {
        if (options.fail && typeof options.fail == 'function') {
            options.fail(result);
        }
    };

    // 处理请求结果
    response.then(result => {
        // 处理意外情况
        if (!result) {
            return false;
        } else if (!result.data) {
            Message.error({
                content: '接口未响应数据',
                duration: messageStayDuration,
                onClose: failCallback(result.data)
            });
            return false;
        }

        if (result.data.error !== 0) {
            // 操作失败 自动提示
            if (!options.hideTip && !options.hideErrorTip) {
                Message.error({
                    content: options.failTip || result.data.message || '操作失败',
                    duration: messageStayDuration,
                    // onClose: failCallback(result.data)
                });
            }

            // 登录失效
            // if (result.data.error === 110022 || result.data.error === 10002) {
            //     account.loginExpire();
            //     return false;
            // }
            if(result.data.error === 211223){
                ViewUI.Message.info('请先登录')
                router.push({path:'/account/login'})
                // window.location.href =  '/pc/account/login'
            }

            // 不提示直接走失败回调
            failCallback(result.data);
        } else {

            // 操作成功 自动提示
            if (!options.hideTip && !options.hideSuccessTip) {
                Message.success({
                    content: options.successTip || result.data.message || '操作成功',
                    duration: messageStayDuration,
                    onClose: successCallback(result.data)
                });
                return false;
            }
            // 不提示直接走成功回调
            successCallback(result.data);
        }
    });
};

/**
 * GET请求
 * @param route API路由
 * @param params 请求参数
 * @param options{{success: '成功回调', fail: '失败回调', hideTip: '隐藏提示', hideSuccessTip: '隐藏成功提示', hideErrorTip: '隐藏错误提示', successTip: '成功提示', failTip: '失败提示', timeout: '超时时间', headers: '请求头'}} 附加选项
 * @returns {{}}
 */
request.get = (route, params, options) => {
    return request.request('get', route, params, options);
};

/**
 * POST请求
 * @param route API路由
 * @param params 请求参数
 * @param options{{success: '成功回调', fail: '失败回调', hideTip: '隐藏提示', hideSuccessTip: '隐藏成功提示', hideErrorTip: '隐藏错误提示', successTip: '成功提示', failTip: '失败提示', timeout: '超时时间', headers: '请求头'}} 附加选项
 * @returns {{}}
 */
request.post = (route, params, options) => {
    return request.request('post', route, params, options);
};

/**
 * 获取表单数据
 * @param view
 * @param route
 * @param params
 * @param callback
 * @returns {{}}
 */
request.getForm = (view, route, params, callback) => {
    let paths = view.$route.path.split('/');
    let action = paths[paths.length - 1];
    route = route + '/' + action;

    if (typeof callback === 'function') {
        // 如果回调是方法，直接传入success方法
        callback = {
            hideSuccessTip: true,
            success: callback,
        };
    } else if (typeof callback === 'object') {
        // 如果回调是对象并且未定义隐藏tip
        if (callback.hideSuccessTip === undefined) {
            callback.hideSuccessTip = true;
        }
    }

    return request.get(route, params, callback);
};

/**
 * 提交表单数据
 * @param view
 * @param route
 * @param params
 * @param callback
 * @returns {{}}
 */
request.submitForm = (view, route, params, callback) => {
    let paths = view.$route.path.split('/');
    let action = paths[paths.length - 1];
    route = route + '/' + action;
    return request.post(route, params, callback);
};


// request.uploadFile = (path = '', params = {}) => {
//
// }

export default request;
