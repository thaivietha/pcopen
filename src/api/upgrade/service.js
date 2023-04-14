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
 * 更新服务端补丁接口
 * @type {{getList: (function(*=, *=): {})}}
 */
const upgradeServiceApi = {

    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getNextVersion: (params, callback) => {
        return request.get('/upgrade/service-patch/get-next-version', params, callback);
    },

    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getList: (params, callback) => {
        return request.get('/upgrade/service-patch/list', params, callback);
    },

    /**
     * 删除补丁
     * @param params
     * @param callback
     * @returns {{}}
     */
    delete: (params, callback) => {
        return request.post('/upgrade/service-patch/delete', params, callback);
    },

    /**
     * 生成补丁
     * @param params
     * @param callback
     * @returns {{}}
     */
    build: (params, callback) => {
        return request.post('/upgrade/service-patch/build', params, callback);
    },

    /**
     * 发布补丁
     * @param params
     * @param callback
     * @returns {{}}
     */
    release: (params, callback) => {
        return request.post('/upgrade/service-patch/release', params, callback);
    },

    /**
     * 修改公开状态
     * @param params
     * @param callback
     * @returns {{}}
     */
    changePublic: (params, callback) => {
        return request.post('/upgrade/service-patch/change-public', params, callback);
    },
};

export default upgradeServiceApi;
