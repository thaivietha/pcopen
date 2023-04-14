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
import request from '../../util/request';

const accountApi = {};

/**
 * 提交登录
 * @param params
 * @param options
 */
accountApi.login = (params, options) => {
    return request.post('/member/index/login', params, options);
};
/**
 * 获取哟用户信息
 * @param params
 * @param options
 */
accountApi.userInfo = (params, options) => {
    return request.post('/member/index/user-info', params, options);
};

/**
 * 退出登录
 * @param params
 * @param options
 */
// accountApi.logout = (params, options) => {
//     return request.post('/account/logout', params, options);
// };

/**
 * 获取session-id
 * @param params
 * @param options
 * @returns {{}}
 */
accountApi.getSessionId = (params, options) => {
    return request.post('/member/index/get-session-id', params, options);
};

accountApi.sendSms = (params, options) => {//发送短信
    return request.post('/member/index/send-sms', params, options);
};
accountApi.checkSmsCode = (params, options) => {//校验短信验证码
    return request.post('/member/index/check-sms-code', params, options);
};
accountApi.register = (params, options) => {//注册
    return request.post('/member/index/register', params, options);
};
accountApi.resetPass = (params, options) => {//重置密码
    return request.post('/member/index/forget-password', params, options);
};


export default accountApi;
