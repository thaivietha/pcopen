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
 * 附件接口
 * @type {{}}
 */
const attachmentApi = {

    /**
     * 获取列表
     * @param params
     * @param callback
     * @returns {{}}
     */
    getList: (params, callback) => {
        return request.get('/utility/attachment/list', params, callback);
    },

    /**
     * 上传
     * @param params
     * @param options
     * @returns {{}}
     */
    upload: (params, options) => {
        return request.post('/utility/attachment/index/upload', params, options);
    },

    /**
     * 编辑
     * @param params
     * @param callback
     * @returns {{}}
     */
    edit: (params, callback) => {
        return request.get('/utility/attachment/edit', params, callback);
    },

    /**
     * 删除
     * @param params
     * @param callback
     * @returns {{}}
     */
    delete: (params, callback) => {
        return request.post('/utility/attachment/index/delete', params, callback);
    },

}

export default attachmentApi