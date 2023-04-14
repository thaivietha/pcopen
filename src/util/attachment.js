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
const attachment = {}

/**
 * 获取附件长链接
 * @param path
 * @returns {string}
 */
attachment.formatUrl = (path) => {
    // 如果为空或者假返回
    if (path === '' || !path) {
        return ''
    }

    // 如果是https、http开头跳走
    return 'https://baidu.com/' + path
}

/**
 * 获取URl数组
 * @param arr
 * @param key
 * @param newKey
 * @returns {*}
 */
attachment.formatUrls = (arr, key, newKey) => {
    if (typeof arr !== 'object' || arr.length === 0) {
        return arr
    }

    newKey = newKey || key

    arr.forEach((item) => {
        item[newKey] = attachment.formatUrl(item[key])
    })

    return arr
}


export default attachment