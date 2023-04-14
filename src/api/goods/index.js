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
import request from "../../util/request";

/**
 * 兑换码接口
 * @type {{}}
 */
const goodsApi = {
    getDetail: (params, callback) => {
        return request.get('/product/detail/get-detail', params, callback);
    },
    favorite: (params, callback) => {
        return request.post('/product/detail/change-favorite', params, callback);
    },
    getOption: (params, callback) => {//选择规格
        return request.get('/product/detail/get-option', params, callback);
    },
    changeTotal: (params, callback) => {//购物车数量修改
        return request.post('/product/cart/change-total', params, callback);
    },
    cartCount: (callback) => {//获取购物车数量
        return request.get('/product/cart/get-count', {}, callback);
    },
    cartList: (callback) => {//获取购物车列表
        return request.get('/product/cart/get-list', {}, callback);
    },
    cartSelect: (params, callback) => {//购物车选中
        return request.post('/product/cart/select', params, callback);
    },
    cartDelete: (params, callback) => {//购物车删除
        return request.post('/product/cart/delete', params, callback);
    },
    checkSelect: (params, callback) => {//校验购物车商品是否可下单
        return request.post('/product/cart/check-select', params, callback);
    },
    getGroupGoods: (params, callback) => {//校验购物车商品是否可下单
        return request.get('/pc/basic/get-goods-group-goods-ids', params, callback);
    },





};

export default goodsApi;
