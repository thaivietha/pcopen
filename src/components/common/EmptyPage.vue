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
<template>
    <div class="empty-box">
        <div class="box">
            <img src="../../../static/images/empty.png" alt="">
        </div>
        <span>{{msg}}</span>
    </div>
</template>

<script>
export default {
    name: "EmptyPage",
    props:{
        msg:{
            type:String,
            default:'这里是空的，什么都没有～'
        }
    }
}
</script>

<style scoped lang="scss">
    .empty-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 200px;
        text-align: center;
        .box{
            width: 200px;
            height: auto;
            margin-bottom: 20px;
            img{
                width: 200px;
                height: auto;
            }
        }
        span{
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            align-items: center;
            color: #C9CDD4;

        }
    }
</style>