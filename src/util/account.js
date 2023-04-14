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
import storage from './storage';
import accountApi from "../api/account";
import menu from './menu';

const account = {};

// 用户登录会话Key
const USER_LOGIN_SESSION_KEY = 'userLogin';
const USER_LOGIN_SESSION_ID_KEY = 'userSessionId';

/**
 * 提交登录
 * @param user {{}} 用户登录信息
 * @param callback {function} 回调方法
 */
account.login = (user, callback) => {
    // 记录缓存
    storage.set(USER_LOGIN_SESSION_KEY, user);

    // 刷新缓存顶部按钮
    menu.resetStorageTopMenus();

    if (typeof callback === 'function') {
        return callback();
    }

    return true;
};

/**
 * 检测登录
 */
account.isLogin = () => {
    return !!account.getSessionId();
};

/**
 * 获取登录会话
 * @returns {any}
 */
// account.getSession = () => {
//     return storage.get(USER_LOGIN_SESSION_KEY);
// };

/**
 * 退出登录
 * @param callback {function}
 */
account.logout = (callback) => {
    storage.remove(USER_LOGIN_SESSION_KEY);
    storage.remove(USER_LOGIN_SESSION_ID_KEY);

    if (typeof callback === 'function') {
        return callback();
    }

    return true;
};

/**
 * 登录
 * @returns {boolean}
 */
account.loginExpire = () => {
    // 退出登录
    account.logout(null);
    setTimeout(() => {
        window.location.href = '/account/login';
    }, 1500)
    return false;
};

/**
 * 检测session-id
 */
account.checkSessionId = (reset) => {
    // 如果存在，跳出
    if (!reset && account.getSessionId()) {
        return true;
    }
    // 调用接口请求
    accountApi.getSessionId({}, {
        hideSuccessTip: true,
        success: (res) => {
            if (res.code === 0) {
                storage.set(USER_LOGIN_SESSION_ID_KEY, {
                    session_id: res.data['session-id']
                });
            }
        },
    })

};


/**
 * 获取session-id
 */
account.getSessionId = () => {
    let obj = storage.get(USER_LOGIN_SESSION_ID_KEY);
    if (obj) {
        return obj.session_id;
    }
    return false;
};

export default account;
