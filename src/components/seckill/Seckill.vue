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
    <div class="boxs-container">
        <div class="boxs">
            <div v-if="showTitle" class="boxs-top">
                <div class="flex">
                    <h3 class="top-title">限时秒杀</h3>
                    <a class="top-more" href="/pc/seckillArea/index">
                        <span class="top-sub"> 查看更多 </span>
                        <Icon type="ios-arrow-forward"/>
                    </a>
                </div>
            </div>
            <div class="boxs-content">
                <ul class="box-list">
                    <!--秒杀图-->
                    <li class="box-item box-item-seckill">
                        <h4>限时秒杀</h4>
                        <div class="time-box">
                            <p class="time-tip">{{ timeTitle }}</p>
                            <div class="time-out">
                                <template v-for="(time,index) in countDownArr">
                                    <div v-if="time" :key="index" class="flex">
                                        <span>{{ time }}</span>
                                        <i class="day" v-if="index === 0 ">天</i>
                                        <i v-else-if="index != 0 && index + 1!= countDownArr.length ">:</i>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </li>
                    <!--正常商品-->
                    <template v-for="(item,index) in goodsList">
                        <li v-if="(minisize && index <= 8) || !minisize " class="box-item" :key="index">
                            <a @click="toDetail(item)">
                                <img :src="$utils.mediaUrl(item.thumb)" alt=""/>
                            </a>
                            <div class="goodsInfo">
                                <p class="item-price">
                                    ¥{{ item | getSeckillPrice | formatMoney }}
                                    <span v-if="item.price" class="item-old-price"> ¥{{ item | getOldPrice | formatMoney }}</span>
                                </p>
                                <h3 class="item-title">{{ item.title }}</h3>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import {countDownFun} from '@/util/jsTool'
import commonApi from '@/api/common'

export default {
    props: {
        showTitle: {
            type: Boolean,
            default: true
        },
        seckillActivityInfo: {
            type: Object
        },
        minisize: {//默认最多显示9个
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            temp: null,
            countDownArr: [],//倒计时
            goodsList: [],
            timeTitle: '距结束'//距结束 距开始
        }
    },
    watch: {
        'seckillActivityInfo': {
            handler(val) {
                if (val.client_type) {
                    this.getTimeOut()
                    this.getGoodsList()
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        toDetail(item) {
            this.$router.push('/goods/detail?id=' + item.id)
        },
        getGoodsList() {
            commonApi.getGoodsList({
                id: this.seckillActivityInfo.goods_ids,
                get_activity: 1,
                activity_type: 'seckill',
                activity_id: this.seckillActivityInfo.id,
            }, {
                hideSuccessTip: true,
                success: (res) => {
                    if (res.error !== 0) return
                    this.goodsList = res.list


                }
            })
        },
        getTimeOut() {
            clearInterval(this.temp)
            let endTime = new Date(this.seckillActivityInfo.end_time).getTime()//结束时间
            let startTime = new Date(this.seckillActivityInfo.start_time).getTime()//开始时间
            let nowTime = new Date().getTime()//现在时间
            startTime > nowTime ? this.timeTitle = '距开始' : this.timeTitle = '距结束'
            this.endTime = endTime - nowTime //结束时间 减 现在时间
            if (startTime > nowTime){
                this.endTime = startTime - nowTime //开始时间减现在时间
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
    filters:{
        getSeckillPrice(item){
            if(item.has_option == '0') {
                let min_price = item.activities?.seckill.activity_price || 0
                return `${parseFloat(min_price)}`
            } else {
                return parseFloat(item?.activities?.seckill.price_range?.min_price || 0)
            }
        },
        getOldPrice(item){
            if(item.has_option=='1') {
                let max_price = item.max_price ||0
                return `${parseFloat(max_price)}`
            } else {
                return parseFloat(item?.price || 0)
            }
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000) + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.temp)
    }
}
</script>

<style scoped lang="scss">

.boxs-container {
    width: 100%;
    height: auto;

}

.boxs {
    position: relative;
    width: 1200px;
    height: auto;
    padding-bottom: 26px;
    margin: 0 auto;
}

.top-kv {
    padding-bottom: 40px;
}

.boxs-top {
    width: 100%;
    padding-bottom: 20px;

    > .flex {
        width: 100%;
        justify-content: space-between;
        height: 28px;
        align-items: flex-end;
    }

    .top-title {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        //color: #212121;
    }

    .top-more {
        display: flex;
        align-items: center;
        color: #81878E;
        font-size: 16px;
        cursor: pointer;

        &:hover {
            color: $theme-color;
        }

        i {
            margin-left: 6px;
            font-size: 18px;

        }

    }

}

.boxs-content {
    display: flex;
    align-items: center;
}

.box-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    width: 100%;
    height: 100%;

    .box-item {
        position: relative;
        margin: 0 0 14px 14px;
        width: 229px;
        overflow: hidden;
        height: 400px;
        background: #fff;
        transition: all 0.3s;

        &:nth-child(1) {
            margin-left: 0;
        }

        &:nth-child(5n) {
            margin-left: 13px;
        }

        &:nth-child(5n + 1) {
            margin-left: 0px;
        }

        &:hover {
            transform: translateY(-1px);
            box-shadow: 5px 5px 20px #ccc;
        }

        &.box-item-seckill { //主推图尺寸
            margin-left: 0px;
            width: 229px;
            height: 400px;
            background-image: url("../../../static/images/seckill/seckilBg.png");
            background-size: 229px 400px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: space-between;
            padding-top: 40px;
            padding-bottom: 40px;

            h4 {
                font-size: 38px;
                line-height: 56px;
                color: #FFFFFF;
            }

            .time-box {
                text-align: center;

                .time-tip {
                    color: #FFFFFF;
                    font-size: 20px;
                    line-height: 30px;
                    font-weight: 600;

                    span {
                        font-weight: normal;
                        font-size: 16px;
                    }
                }

                .time-out {
                    margin-top: 30px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    color: #ffffff;
                    font-weight: 600;
                    justify-content: center;

                    span {
                        line-height: 32px;
                        text-align: center;
                        display: block;
                        min-width: 32px;
                        height: 32px;
                        font-size: 18px;
                        background: #3E413E;

                    }

                    i {
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
        }

        img {
            display: block;
            width: 229px;
            height: 280px;
            margin: 0 auto;
        }

        .goodsInfo {
            height: 120px;
            padding: 20px 10px 0;

            .item-title {
                font-size: 16px;
                line-height: 22px;
                text-align: left;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }

            .item-price {
                margin-bottom: 8px;
                color: $price-color;
                font-size: 20px;
                line-height: 28px;
                font-weight: 600;
            }

            .item-old-price {
                font-weight: normal;
                margin-left: 10px;
                color: #AAB3BD;
                font-size: 14px;
                line-height: 20px;
                text-decoration: line-through;
            }
        }

    }
}
</style>
