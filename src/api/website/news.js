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
 * 新闻接口
 * @type {{getList: (function(*=): {})}}
 */

const newsApi = {
    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getList: (params, callback) => {
        return request.get('/website/news/list', params, callback);
    },

    /**
     * 删除文章
     * @param params
     * @param callback
     * @returns {{}}
     */
    delete: (params, callback) => {
        return request.post('/website/news/delete', params, callback);
    },

    /**
     * 修改状态
     * @param params
     * @param callback
     * @returns {{}}
     */
    changeStatus: (params, callback) => {
        return request.post('/website/news/change-status', params, callback);
    },
}

export default newsApi;
