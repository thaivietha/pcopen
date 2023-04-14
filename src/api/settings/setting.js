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

const settingApi = {
    /**
     * @param params
     * @param callback
     * @returns {{}}
     */
    getSysSetting: (params, callback) => {//商城设置
        return request.get('/index/get-set', params, callback);
    },
    getAddress: (params, callback) => {
        return request.get('/index/get-address', params, callback);
    },
    getChannelStatus: (params, callback) => {//获取渠道状态
        return request.get('/index/get-channel-status', params, callback);
    },
    getWxCode: (params, callback) => {
        return request.get('/apps/wxapp/qr-code/get', params, callback);
    },
    runAsyncTask: (params, callback) => {//执行异步任务
        return request.get('/utility/asyncTask/execute', params, callback);
    },

}
export default settingApi;