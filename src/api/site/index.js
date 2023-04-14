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
 * 站点接口
 * @type {{getList: (function(*=): {})}}
 */
const siteApi = {
    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getList: (params, callback) => {
        return request.get('/site/list/all', params, callback);
    },

    /**
     * 正常授权站点列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getNormalList: (params, callback) => {
        return request.get('/site/list/normal', params, callback);
    },

    /**
     * 暂停授权站点列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getPauseList: (params, callback) => {
        return request.get('/site/list/pause', params, callback);
    },

    /**
     * 授权到期站点列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getExpireList: (params, callback) => {
        return request.get('/site/list/expire', params, callback);
    },

    /**
     * 获取域名IP
     * @param params
     * @param callback
     * @returns {{}}
     */
    getRealIp: (params, callback) => {
        return request.get('/site/util/get-domain-ip', params, callback);
    },

    /**
     * 生成站点加密许可
     * @param params
     * @param callback
     * @returns {{}}
     */
    buildLicense: (params, callback) => {
        return request.post('/site/index/build-license', params, callback);
    },

    /**
     * 生成站点文件
     * @param params
     * @param callback
     * @returns {{}}
     */
    buildFile: (params, callback) => {
        return request.post('/site/index/build-file', params, callback);
    },

    /**
     * 修改站点修复状态
     * @param params
     * @param callback
     * @returns {{}}
     */
    changeRepairStatus: (params, callback) => {
        return request.post('/site/index/change-repair-status', params, callback);
    },

    /**
     * 获取V3授权信息
     * @param params
     * @param callback
     * @returns {{}}
     */
    getV3AuthInfo: (params, callback) => {
        return request.get('/site/index/get-v3-auth-info', params, callback);
    },

};

export default siteApi;
