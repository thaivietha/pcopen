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
const util = {};
let settings = require('@/config/settings.js').config
/**
 * 设置浏览器标题
 * @param title {string} 标题
 */
util.setTitle = function (title) {
    window.document.title = title || '';
};

/**
 * 获取URL
 * @param route {string} 路由
 * @param params {object} 参数
 * @returns {string}
 */
util.formatUrl = (route, params) => {
    // 如果路由中包含http或者https
    if (route.indexOf('http://') !== -1 || route.indexOf('https://') !== -1) {
        return route;
    }

    if (params && typeof (params) === 'object' && JSON.stringify(params) !== '{}') {
        route += (route.indexOf('?') === -1 ? '?' : '&') + util.formatParam(params);
    }

    let url = settings?.base_url || '';
    if (process.env.NODE_ENV === 'development') {
        url = '/api'
    }
    if (url.substr(-1, 1) === '/') {
        url = url.substr(-1);
    }


    return url + route;
};

/**
 * 判断元素是否在数组中
 * @param elem
 * @param arr
 * @param i
 * @returns {number|*}
 */
util.inArray = (elem, arr, i) => {
    let len;

    if (arr) {
        len = arr.length;
        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
        for (; i < len; i++) {
            if (i in arr && arr[i] === elem) {
                return i;
            }
        }
    }

    return -1;
};

/**
 * 处理参数
 * @param params
 * @param separator
 */
util.formatParam = (params, separator) => {
    if (typeof params === 'object') {
        let str = '';
        if (!separator) {
            separator = '&';
        }

        // 遍历转换
        util.each(params, (k, v) => {
            str += separator + k + '=' + v;
        });

        return str.substr(1);
    } else {
        return params;
    }
};

util.isArraylike = (obj) => {
    let length = obj.length,
            type = typeof obj;

    if (type === 'function') {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return type === 'array' || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
};

/**
 * 遍历
 * @param obj
 * @param callback
 * @param args
 * @returns {*}
 */
util.each = (obj, callback, args) => {
    let value,
            i = 0,
            length = obj.length,
            isArray = util.isArraylike(obj);
    if (args) {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.apply(obj[i], args);
                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.apply(obj[i], args);
                if (value === false) {
                    break;
                }
            }
        }
    } else {
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        }
    }
    return obj;
};

/**
 * 成成32位随机数
 */
util.randomNum = (randomFlag, min, max) => {
    let str = '',
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }

    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos]
    }
    return str;
}

/**
 * 格式化日期时间
 * @param date
 * @returns {string}
 */
util.formatDateTime = (date) => {
    if (typeof date === 'string') {
        if (date === '') {
            return '';
        }
        date = new Date(date);
    }

    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;

    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;

    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;

    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;

    let second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;

    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

/**
 * 深度克隆
 * @param object
 * @returns {any}
 */
util.clone = (object) => {
    return JSON.parse(JSON.stringify(object));
}

/**
 * 保留两位小数
 * @param num
 * @returns {string}
 */
util.toFixed = (num) => {
    let times = Math.pow(10, 2)
    let des = num * times + 0.5
    des = parseInt(des, 10) / times;
    return des + '';
}

export default util;
