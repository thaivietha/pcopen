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
export default [
    {
        name: 'order-list',
        title: '订单',
        icon: '',
        children: [
            {
                name: '提交订单',
                title: '提交订单',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/confirm'
            },
            {
                name: '确认订单',
                title: '确认订单',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/payment'
            },
            {
                name: '微信支付',
                title: '微信支付',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/wxPay'
            }, {
                name: '支付宝支付',
                title: '支付宝支付',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/aliPay'
            }, {
                name: '余额支付',
                title: '余额支付',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/balancePay'
            },
            {
                name: '订单详情',
                title: '订单详情',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/orderDetail'
            },
            {
                name: '物流查询',
                title: '物流查询',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/package'
            },
            {
                name: '申请退款',
                title: '申请退款',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/refund'
            },
            {
                name: '售后详情',
                title: '售后详情',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/refundDetail'
            },
            {
                name: '评价列表',
                title: '评价列表',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/commentList'
            },
            {
                name: '评价',
                title: '评价',
                meta:{
                    perm:true
                },
                icon: '',
                path: '/order/comment'
            },
        ],
    }
];
