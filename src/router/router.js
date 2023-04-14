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
export default [//全部都是一级菜单
    {
        title: '主页',
        name: 'index',
        icon: 'ios-compass',
        path: '/index',
        hideCrumbs: true,
    },
    {
        title: '商品分类',
        name: 'categories',
        icon: '',
        path: '/categories',
    }, {
        title: '限时秒杀',
        name: 'seckillArea',
        icon: '',
        path: '/seckillArea',
    },
    {
        title: '商品组',
        name: 'goodsArea',
        icon: '',
        path: '/goodsArea',
    },
    {
        title: '个人中心',
        name: 'user',
        icon: '',
        path: false,

    },
    {
        title: '订单',
        name: 'order',
        icon: 'ios-paper',
        path: '/order',
    },
    {
        title: '商品',
        name: 'goods',
        icon: '',
        perm: '',
    },
    {
        title: '领券中心',
        name: 'coupon',
        icon: '',
        perm: '',
    },
    {
        title: '购物车',
        name: 'shoppingCart',
        icon: 'ios-switch',
        perm: 'site',
    },

];
