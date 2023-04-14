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
    <div class="el-box">
        <div class="title">
            {{ goodsDetail.title || '' }}
        </div>
        <p class="subTitle"> {{ goodsDetail.sub_title || '' }}</p>
        <div class="price-box flex">
            <div class="top-left">
                                    <span v-if="actionsData.original_price > 0 || goodsDetail.original_price > 0">原价：￥{{
                                            actionsData.original_price || goodsDetail.original_price
                                        }}</span>
                <p>{{ getPrice }}</p>
            </div>
            <div class="top-right">
                <span>{{ goodsDetail.sales || '0' }}</span>
                <p>销量</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "vip",
    props:['goodsDetail','actionsData','member_price'],
    computed:{
        hasOption(){
            return this.goodsDetail.has_option=='1'
        },
        getPrice(){
            if(this.actionsData.goods_id){
                console.log(this.actionsData)
                if(this.actionsData.activity)  return this.actionsData.activity.member_price.min_price
                return this.actionsData.price
            }
            if(!this.hasOption) {
                return this.formatMoney(this.member_price?.min_price)
            } else {
                let {min_price,max_price} = this.member_price
                let price = `${this.formatMoney(min_price)}-${this.formatMoney(max_price)}`
                return this.$utils.formartPrice(price)
            }
        },
    },
    methods:{
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000).toFixed(2) + '万'
                } else {
                    return parseFloat(money).toFixed(2)
                }
            } else {
                return 0
            }
        },
    }
}
</script>

<style scoped lang="scss">
.el-box {
    .title {
        font-size: 24px;
        line-height: 34px;
        margin-bottom: 20px;
    }
    .subTitle {
        font-size: 14px;
        line-height: 20px;
        color: #636669;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        .seckill {
            color: #FFFFFF;
            font-size: 12px;
            width: 30px;
            height: 18px;
            display: inline-block;
            background: $theme-BgColor;
            border-radius: 2px;
            margin-right: 10px;
            text-align: center;
            line-height: 18px;
        }
    }
    .price-box {
        background: url("../../../assets/images/Frame1685.png") center no-repeat ;
        background-size: cover;
        color: #FFFFFF;
        padding: 13px 30px;
        height: 84px;
        justify-content: space-between;

        .top-left {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;

            span {
                text-align: left;
                font-size: 14px;
                line-height: 20px;
                text-decoration: line-through;
                margin-bottom: 6px;
            }

            p {
                font-weight: 600;
                font-size: 34px;
                line-height: 30px;
                color: #F7F9FF;

                &:before {
                    content: '¥';
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 30px;
                    width: 24px;
                    text-align: center;
                    display: inline-block;
                }
            }
        }

        .top-right {
            padding-left: 30px;
            position: relative;
            text-align: center;
            &:before {
                content: '';
                height: 40px;
                width: 1px;
                background-color: rgba(255, 255, 255, 0.5);
                position: absolute;
                left: 0;
                top: 6px;
            }

            span {
                font-weight: 600;
                font-size: 20px;
                line-height: 26px;
                color: #F7F9FF;
                margin-bottom: 6px;
                display: block;
            }

            p {
                font-size: 14px;
                line-height: 20px;
                color: #F7F9FF;

            }
        }
    }
}
</style>