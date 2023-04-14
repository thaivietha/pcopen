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
    <div>
        <div class="tip">
            <span class="iconfont icon-dayang"></span>
            <p>商城已打烊</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "maintenance",
    created(){
        let mall_status = this.$store.state.setting.systemSetting?.basic?.mall_status;
        let channelStatus =this.$store.state.setting.channelStatus
        if(channelStatus == '1' && mall_status == '1'){
            this.$router.replace('/index')
        }
    }
}
</script>

<style scoped lang="scss">
.tip {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    margin: auto;
    width: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    span{
        font-size: 166px;
    }
    p{
        font-size: 26px;
    }
}
</style>