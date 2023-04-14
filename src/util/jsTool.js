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
 * @Description: 工具
 * @author  Gao
 * @date 2022/1/12
 */
let settings = require('../config/settings.js').config
import store from '@/store'

/**
 * 转换图片实际url
 * @author  Gao
 * @param src 单个图片path
 * @param type 图片类型，图片可不传，manage(代表使用本地url拼接)/video(不拼接图片压缩参数)
 * @returns {*}
 */
export function tomediaurl(src, type) {
    // 微信、头条小程序本地图片校验
    let reg = /^((blob:){0,1}http:\/\/(tmp\/wx){0,1})|(wxfile:\/\/tmp_)|(ttfile:\/\/temp\/)\w*/;
    if (src.indexOf('data:') == 0 || reg.test(src)) {
        return src
    }
    if (src.indexOf('http://') !== -1 || src.indexOf('https://') !== -1 || src.indexOf('wxfile://') !== -1) {
        return src
    }

    if (!/\/$/.test(settings.attachment_url)) { //必须是/结尾
        settings.attachment_url = settings.attachment_url + '/'
    }

    if (src.substr(0, 1) === '/') {
        return settings.public_url + src.slice(1);
    } else {
        // 店铺存储地址与图片压缩
        let shopStorage = store.state.setting.shopStorage;
        if ((!type || type === 'video') && shopStorage.attachmentUrl) {
            if (type === 'video') {
                return shopStorage.attachmentUrl + src
            }
            return shopStorage.attachmentUrl + src + (shopStorage.attachmentSuffix ? `?${shopStorage.attachmentSuffix}` : '')
        }
        return settings.attachment_url + src;
    }
}

/**
 * 移动端的图片地址，链接移动端图片用的方法
 * @param {} url
 */
export function staticMedia(url, defaultUrl) {
    settings = require('@/config/settings.js').config
    if (url.indexOf('/') == 0) {
        return url;
    } else if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
        return url;
    } else if (!url && defaultUrl && typeof defaultUrl == 'string') {
        if (defaultUrl.indexOf('/') == 0) {
            return defaultUrl;
        } else if (defaultUrl.indexOf('http://') > -1 || defaultUrl.indexOf('https://') > -1) {
            return defaultUrl;
        } else {
            return settings?.wap_dist_url + defaultUrl;
        }
    }
    return settings?.wap_dist_url + url;
}

export function themeMedia(url) {
    let theme_color = store.state.setting.theme_color;
    if (theme_color != 'default') {
        url = url.replace(/\.png/, `_${theme_color}.png`)
    }
    return staticMedia(url)
}

/**
 * 转换图片实际url
 * @author  Gao
 * @param urls 单个图片/数组图片/富文本
 * @returns {*}
 */
export function mediaUrl(urls, defaultUrl, type) {
    if (!urls) {
        if (defaultUrl && typeof defaultUrl == 'string') {
            return tomediaurl(defaultUrl)
        }
        return ''
    }
    if (typeof urls === 'object') {
        if (urls.type == 'local' || urls.type == 'network') {  // 兼容腾讯视频和本地视频
            if (urls.path.indexOf('http://') !== -1 || urls.path.indexOf('https://') !== -1) {
                return urls.path
            } else {
                let shopStorage = store.state.setting.shopStorage;
                if ((!type || type === 'video') && shopStorage.attachmentUrl) {
                    if (type === 'video') {
                        return shopStorage.attachmentUrl + urls.path
                    }
                    return shopStorage.attachmentUrl + urls.path + (shopStorage.attachmentSuffix ? `?${shopStorage.attachmentSuffix}` : '')
                }
                return settings.attachment_url + urls.path
            }
        } else {
            //数组
            // eslint-disable-next-line no-unused-vars
            urls.forEach(src => {
                src = tomediaurl(src)
            })
            return urls
        }

    } else if (urls.indexOf('<img') !== -1) {
        //富文本
        return urls.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
            return match.replace(capture, tomediaurl(capture, type))
        })
    }
    return tomediaurl(urls, type)
}
// 倒计时方法，return days hours minutes seconds
export function countDown(timePoint, time, stamp = true) {
    // 当前时间
    let now = parseInt(Date.now() / 1000);
    let leftTime = 0; //
    if (timePoint) {
        leftTime = timePoint > now ? (timePoint - now) : 0; //时间差
        leftTime = parseInt(leftTime);
    }
    if (time) {
        leftTime = parseInt(time);
    }
    if (leftTime == 0) {
        return false;
    } else {
        let day = Math.floor(leftTime / (60 * 60 * 24));
        let hour = Math.floor((leftTime - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((leftTime - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(leftTime - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let time;
        if (stamp) {
            time = [day, hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        } else {
            hour = day * 24 + hour
            time = [hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        }
        return time;
    }
}

export function countDownFun(endTimeType, notUnit = true) {
    // console.log(time, serveTime, '传输过来的参数')
    if (endTimeType) {
        //获取时间差
        let timediff = Math.round(endTimeType / 1000);
        //获取还剩多少天
        let day = parseInt(timediff / 3600 / 24);
        //获取还剩多少小时
        let hour = parseInt(timediff / 3600 % 24);
        //获取还剩多少分钟
        let minute = parseInt(timediff / 60 % 60);
        //获取还剩多少秒
        let second = timediff % 60;
        // let ms = serveTime % 1000 / 100

        if (notUnit) {
            let d = day != 0 ? day : null
            d = day != 0 && d < 10 ? '0' + d : d
            let h = hour < 10 ? '0' + hour : hour
            let m = minute < 10 ? '0' + minute : minute
            let s = second < 10 ? '0' + second : second
            let layout = [d, h, m, s]
            return layout
        } else {//带单位
            var endTime = []
            let d = day != 0 ? day : null
            let h = (hour < 10 ? '0' + hour : hour) + '小时'
            let m = (minute < 10 ? '0' + minute : minute) + '分钟'
            let s = (second < 10 ? '0' + second : second) + '秒'
            endTime = [h, m, s]
            if (d) {
                d = d + '天'
                endTime.unshift(d)
            }
            return endTime
        }
    } else {
        return '-'
    }
}

/**
 * 比较两个对象是否key：val相等
 */
export const compareObj = (obj1, obj2) => {
    var propsCurr = Object.getOwnPropertyNames(obj1);
    // 要比较的另外一个Object对象
    var propsCompare = Object.getOwnPropertyNames(obj2);
    if (propsCurr.length != propsCompare.length) {
        return false;
    }
    for (var i = 0, max = propsCurr.length; i < max; i++) {
        var propName = propsCurr[i];
        if (obj1[propName] !== obj2[propName]) {
            return false;
        }
    }
    return true;
};

/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 * 深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function deepCompare(oldData, newData) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // 类型为对象并且元素个数相同
        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            // eslint-disable-next-line no-prototype-builtins
            if (oldData.hasOwnProperty(key)) {
                if (!deepCompare(oldData[key], newData[key]))
                        // 对象中具有不相同属性 返回false
                    return false;
            }
        }
    } else if (isArray(oldData) && isArray(newData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同
        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!deepCompare(oldData[i], newData[i]))
                    // 如果数组元素中具有不相同元素,返回false
                return false;
        }
    } else {
        // 其它类型,均返回false
        return false;
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
}

export function deepCopy(obj1, obj2) { //深拷贝
    if (typeof obj1 != 'object') {
        return obj1;
    }
    //深拷贝
    if (obj2 === undefined) {
        if (Array.isArray(obj1)) {
            obj2 = []
        } else {
            obj2 = {}
        }
    }
    for (let i in obj1) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj1.hasOwnProperty(i)) {
            if (Array.isArray(obj1[i])) {
                obj2[i] = [];
                deepCopy(obj1[i], obj2[i]);
            } else if (typeof obj1[i] === "function") {
                obj2[i] = obj1[i];
            } else if (obj1[i] instanceof Object) {
                obj2[i] = {};
                deepCopy(obj1[i], obj2[i]);
            } else {
                obj2[i] = obj1[i];
            }
        }
    }
    return obj2;
}

/**
 * 如果target(也就是FirstOBJ[key])存在，
 * 且是对象的话再去调用deepObjectMerge，
 * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
 */
export function deepMerge(FirstOBJ, SecondOBJ) { // 深度合并对象
    if (FirstOBJ === SecondOBJ) {
        return FirstOBJ
    }
    if (typeof SecondOBJ != 'object' || SecondOBJ === null || typeof FirstOBJ != 'object') {
        return FirstOBJ
    }
    if (FirstOBJ === null) {
        return SecondOBJ
    }
    for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
                deepMerge(FirstOBJ[key], SecondOBJ[key]) : (FirstOBJ[key] = SecondOBJ[key]);
    }
    return FirstOBJ;
}

/**
 * 遍历数据，将空字符串换成空字符串
 */
export function exchangeArrayToString(data) {
    // 深拷贝一层
    let obj = Object.assign({}, data);
    for (let o in obj) {
        if (obj[o] instanceof Array && obj[o].length === 0) {
            obj[o] = '';
        }
    }
    return obj;
}
// 多规格价格相等时返回一个价格
export const formartPrice = function (price, code = '-') {
    if (typeof price !== 'string') {
        return price
    }

    let arr = price.split(code)
    if (arr.length == 2 && arr[0] == arr[1]) {
        return arr[0]
    } else {
        return price
    }
}
//乘法计算
export const  floatMul = function (arg1,arg2) {
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){
        console.log(e)
    }
    try{m+=s2.split(".")[1].length}catch(e){
        console.log(e)
    }
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}