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
import storage from "@/util/storage";

const perm = {
    loaded: false,
};

// 用户登录会话Key
const USER_LOGIN_SESSION_KEY = 'userLogin';

/**
 * 检测访问权限
 * @returns {boolean}
 * @param permission
 */
perm.check = (permission) => {

    let user = storage.get(USER_LOGIN_SESSION_KEY);
    if (!user || !user.perm) {
        return false;
    }
    return user.perm.includes(permission);
};

export default perm;
