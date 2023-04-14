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
 * @Description: 公共方法
 * @author  Gao
 * @date 2022/1/27
 */

import request from '../../util/request';

const commonApi = {
    /**
     * 获取公共头部 底部 数据
     * @param params
     * @param callback
     * @returns {{}}
     */
    getBasicInfo: (callback) => {
        return request.get('/pc/basic/info', {}, callback);
    },
    getGoodsList: (params, callback,) => {//查询
        return request.get('/product/list/get-list', params, callback);
    },
    getAddress: (callback,) => {//地址库
        return request.get('/index/get-address-list2', {}, callback);
    },


}

export default commonApi;
