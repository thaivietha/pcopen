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
 * @Description: 订单相关
 * @author  Gao
 * @date 2022/2/7
 */
import request from "../../util/request";

const orderApi = {
    getComment: (params, callback) => {
        return request.get('/order/comment/list', params, callback);
    },
    confirm: (params, callback) => {
        return request.post('/order/create/confirm', params, callback);
    },
    create: (params, callback) => {
        return request.post('/order/create/index', params, callback);
    },
    allOrderList: (params, callback) => {// 全部订单列表
        return request.get('/order/list/all', params, callback);
    },
    payOrderList: (params, callback) => {// 待付款订单列表
        return request.get('/order/list/pay', params, callback);
    },
    sendOrderList: (params, callback) => {// 待发货订单列表
        return request.get('/order/list/send', params, callback);
    },
    pickOrderList: (params, callback) => {// 待收货订单列表
        return request.get('/order/list/pick', params, callback);
    },
    finishOrderList: (params, callback) => {// 已完成订单列表
        return request.get('/order/list/finish', params, callback);
    },
    refundOrderList: (params, callback) => {// 维权列表
        return request.get('/order/refund/list', params, callback);
    },
    orderDetail: (params, callback) => {
        return request.get('/order/detail/index', params, callback);
    },
    orderPayList: (params, callback) => {
        return request.get('/pay/index', params, callback);
    },
    orderPay: (params, callback) => {
        return request.post('/pay/index/pay', params, callback);
    },
    orderPayCheck: (params, callback) => {
        return request.post('/pay/index/check', params, callback);
    },
    orderGetTotal: (callback) => {//订单状态
        return request.post('/order/list/get-total', {}, callback);
    },
    orderCancel: (params,callback) => {//取消订单
        return request.post('/order/op/cancel', params, callback);
    },
    orderDelete: (params,callback) => {//删除订单
        return request.post('/order/op/delete', params, callback);
    },
    orderFinish: (params,callback) => {//确认收货
        return request.post('/order/op/finish', params, callback);
    },
    getExpress: (params,callback) => {//查看物流
        return request.get('/order/detail/get-express', params, callback);
    },
    orderRefund: (params,callback) => {//售后信息
        return request.get('/order/refund', params, callback);
    },
    refundSubmit: (params,callback) => {//提交售后信息
        return request.post('/order/refund/submit', params, callback);
    },
    refundDetail: (params,callback) => {//售后信息详情
        return request.get('/order/refund/detail', params, callback);
    },
    refundCancel: (params,callback) => {//取消售后
        return request.get('/order/refund/cancel', params, callback);
    },
    getCommentList: (params,callback) => {//待评价列表
        return request.get('/order/comment/wait-list', params, callback);
    },
    getCommentGoods: (params,callback) => {//获取评价商品
        return request.get('/order/comment/write-comment', params, callback);
    },
    submitComment: (params,callback) => {//写评价
        return request.post('/order/comment/write-comment', params, callback);
    },

};

export default orderApi;
