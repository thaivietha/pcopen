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

/**
 * 用户接口
 * @type {{getList: (function(*=): {})}}
 */

const userApi = {
    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getList: (params, callback) => {
        return request.get('/user/list/get-list', params, callback);
    },
    getCoupon: (params, callback) => {
        return request.get('/member/coupon/get-coupon', params, callback);
    },
    getUserCoupon: (params, callback) => {
        return request.get('/member/coupon/my', params, callback);
    },
    getCouponList: (params, callback) => {//优惠券列表
        return request.get('/member/coupon', params, callback);
    },
    getAddress: (params, callback) => {//获取用户地址
        return request.get('/member/address/index', params, callback);
    },
    createAddress: (params, callback) => {//新建用户地址
        return request.post('/member/address/create', params, callback);
    },
    saveAddress: (params, callback) => {//编辑用户地址
        return request.post('/member/address/save', params, callback);
    },
    deleteAddress: (params, callback) => {//删除用户地址
        return request.get('/member/address/delete', params, callback);
    },

    getUerInfo: (callback) => {//用户信息
        return request.get('/member/index/user-info', {}, callback);
    },
    getFavorite: (params, callback) => {//收藏信息
        return request.get('/member/favorite', params, callback);
    },
    getLoginStatus: (callback) => {//登录状态
        return request.post('/member/index/get-login-status', {}, callback);
    },
    getWxCode: (params, callback) => {//微信登录二维码
        return request.post('/pc/wx-login/get-redirect-url', params, callback);
    },
    setPassword: (params, callback) => {//修改密码
        return request.post('/member/index/change-password', params, callback);
    },
    changeBind: (params, callback) => {//换手机号
        return request.post('/member/index/change-bind-mobile', params, callback);
    },
    bindMobile: (params, callback) => {//绑定手机号
        return request.post('/member/index/bind-mobile', params, callback);
    },



}

export default userApi;
