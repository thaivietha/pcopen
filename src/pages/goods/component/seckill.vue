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
        <div class="title line2">
            {{ goodsDetail.title || '' }}
        </div>
        <p class="subTitle"><span class="seckill">秒杀</span> {{ goodsDetail.sub_title || '' }}</p>
        <div class="price-box flex">
            <div class="top-left">
                <!--<span>原价：￥{{ actionsData.original_price || goodsDetail.original_price }}</span>-->
                <p v-if="getPrice.length < 10">{{ getPrice || '' }}</p>
                <p class="small" v-else>{{ getPrice || '' }}</p>
            </div>
            <div class="top-right">
                <div class="time-box">
                    <span>{{ timeTitle }}</span>
                    <div class="time-out">
                        <div v-for="(time,index) in countDownArr" :key="index">
                            <div v-if="time" class="flex">
                                <span>{{ time }}</span>
                                <i class="day" v-if="index === 0 ">天</i>
                                <i v-else-if="index != 0 && index + 1!= countDownArr.length ">:</i>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="sales">
                    <span>{{ goodsDetail.sales || '0' }}</span>
                    <p>销量</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {countDownFun} from '@/util/jsTool'

export default {
    name: "seckill",
    props:{
        goodsDetail:{
            type:Object
        },
        actionsData:{
            type:Object
        },
        seckillInfo:{
            type:Object
        }
    },
    data() {
        return {
            countDownArr: [],//倒计时
            timeTitle: '距离结束还剩',
            endTime: '',
            temp: null
        }
    },
    watch: {
        goodsDetail:{
            immediate:true,
            handler:function(data){
                if (data) {
                    this.getTimeOut()//倒计时
                }
            }
        },
        actionsData:{
            immediate:true,
            handler:function(data){
                if (data) {
                    console.log(data,'data')
                }
            }
        }

    },
    computed:{
        hasOption(){
            return this.goodsDetail.has_option=='1'
        },
        getPrice(){
            if(this.actionsData.goods_id){
                if(this.actionsData.activity)  return this.actionsData.activity.seckill.activity_price
                return this.actionsData.price
            }
            if(!this.hasOption) {
                return this.formatMoney(this.seckillInfo?.activity_price)
            } else {
                let {min_price,max_price} = this.seckillInfo.price_range
                let price = `${this.formatMoney(min_price)}-${this.formatMoney(max_price)}`
                return this.$utils.formartPrice(price)
            }
        },
    },
    methods: {
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
        getTimeOut() {
            clearInterval(this.temp)
            let endTime = new Date(this.seckillInfo.end_time).getTime()//结束时间
            let startTime = new Date(this.seckillInfo.start_time).getTime()//结束时间
            let nowTime = new Date().getTime()//现在时间
            this.endTime = endTime - nowTime //结束时间 减 现在时间
            startTime > nowTime ? this.timeTitle = '距开始还剩' : this.timeTitle = '距离结束还剩'
            if (startTime > nowTime) {
                this.timeTitle = '距开始还剩'
                this.endTime = startTime - nowTime //开始时间 减 现在时间
            }
            if (this.endTime <= 0) {
                this.countDownArr = [null, '00', '00', '00']
                return
            }
            this.countDownArr = countDownFun(this.endTime)
            this.temp = setInterval(() => {
                this.endTime -= 1000
                // this.countDownArr =>[01,12,34,02]
                this.countDownArr = countDownFun(this.endTime)
            }, 1000)
        },
    },
    beforeDestroy() {
        clearInterval(this.temp)
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
        align-items: flex-start;

        .seckill {
            color: #FFFFFF;
            font-size: 14px;
            width: 44px;
            height: 22px;
            display: inline-block;
            background: $theme-BgColor;
            border-radius: 2px;
            margin-right: 10px;
            text-align: center;
            line-height: 22px;
        }
    }

    .price-box {
        //background: #E93323;
        background: url("../../../assets/images/Frame1685.png") center no-repeat ;
        background-size: cover;
        color: #FFFFFF;
        padding: 13px 30px;
        height: 84px;
        justify-content: space-between;

        .top-left {
            display: flex;
            align-items: center;

            span {
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
                    margin-left: -5px;
                }
                &.small{
                    white-space: nowrap;
                    font-size: 18px;
                    &:before {
                        content: '¥';
                        font-weight: 600;
                        font-size: 18px;
                        line-height: 30px;
                        width: 24px;
                        text-align: center;
                        display: inline-block;
                    }
                }

            }
        }

        .top-right {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            position: relative;

            .time-box {
                margin-right: 36px;
                display: flex;
                align-items: center;
                text-align: center;

                > span {
                    margin-right: 20px;
                    font-size: 16px;
                    color: #ffffff;
                    font-weight: bold;
                }

                .time-out {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    color: $theme-color;
                    font-weight: 600;
                    justify-content: center;

                    span {
                        line-height: 36px;
                        text-align: center;
                        display: block;
                        min-width: 36px;
                        height: 36px;
                        font-size: 20px;
                        background: #ffffff;

                    }

                    i {
                        color: #FFFFFF;
                        font-size: 22px;
                        width: 16px;
                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                    }

                    .day {

                        width: 30px;
                        font-size: 18px;
                        line-height: 32px;
                    }
                }
            }

            .sales {
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


}
</style>